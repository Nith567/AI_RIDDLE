// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAIOracle.sol";
import "./AIOracleCallbackReceiver.sol";
import {IAIOracle} from "./IAIOracle.sol";
import {AIOracleCallbackReceiver} from "./AIOracleCallbackReceiver.sol";
/// @notice User interfacing contract that interacts with OAO
/// @dev Prompt contract inherits AIOracleCallbackReceiver, so that OPML nodes can callback with the result.
contract SPrompts is AIOracleCallbackReceiver {
    string public riddleTheme;
    uint256 public entryCost;
    uint256 public scoreToWin;
    uint256 public prizePool;
    address public winner;

    event promptsUpdated(
        uint256 requestId,
        uint256 modelId,
        string input,
        bytes callbackData,
        bytes outputscored
    );
    event promptRequest(
        uint256 requestId,
        address sender,
        uint256 modelId,
        string prompt
    );

    struct AIOracleRequest {
        address sender;
        uint256 modelId;
        bytes input;
        bytes output;
    }

    /// @dev requestId => AIOracleRequest
    mapping(uint256 => AIOracleRequest) public requests;
    mapping(address => bool) hasDeposited;
    mapping(address => bool) public hasEntered;

    /// @dev modelId => callback gasLimit
    mapping(uint256 => uint64) public callbackGasLimit;
    mapping(address => uint256) Score;
    /// @notice Initialize the contract, binding it to a specified AIOracle.
    constructor(
        IAIOracle _aiOracle, //on arbSepolia proxy address is 0x0A0f4321214BB6C7811dD8a71cF587bdaF03f0A0
        string memory _theme,
        uint256 _entryCost,
        uint256 _scoreToWin
    ) AIOracleCallbackReceiver(_aiOracle) {
        owner = msg.sender;
        riddleTheme = _theme;
        entryCost = _entryCost;
        scoreToWin = _scoreToWin;
        callbackGasLimit[50] = 500_000; // Stable Diffusion
        callbackGasLimit[11] = 5_000_000; // Llama
    }

    modifier noWinnerYet() {
        require(winner == address(0), "Winner already claimed");
        _;
    }

    function deposit() external payable {
        require(msg.value >= entryCost, "Insufficient entry cost");
        prizePool += msg.value;
        hasDeposited[msg.sender] = true;
    }
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    /// @notice sets the callback gas limit for a model
    /// @dev only owner can set the gas limit
    function setCallbackGasLimit(
        uint256 modelId,
        uint64 gasLimit
    ) external onlyOwner {
        callbackGasLimit[modelId] = gasLimit;
    }

    /// @dev uint256: modelID => (string: prompt => string: output)
    mapping(uint256 => mapping(string => string)) public prompts;

    /// @notice returns the output for the specified model and prompt
    function getAIResult(
        uint256 modelId,
        string calldata prompt
    ) external view returns (string memory) {
        return prompts[modelId][prompt];
    }

    /// @notice estimating fee that is spent by OAO
    function estimateFee(uint256 modelId) public view returns (uint256) {
        return aiOracle.estimateFee(modelId, callbackGasLimit[modelId]);
    }
    mapping(address => bytes) response;
    function ScoreForPlayer(address player) public view returns (bytes memory) {
        return response[player];
    }

    function RiddleScore(address player) public view returns (uint256) {
        return riddleScore[player];
    }

    function stringToUint(
        string memory str
    ) public pure returns (uint256 result) {
        bytes memory b = bytes(str);
        result = 0;

        for (uint256 i = 0; i < b.length; i++) {
            // Check that the character is a number (ASCII values from '0' to '9')
            require(
                b[i] >= 0x30 && b[i] <= 0x39,
                "Invalid character in string"
            );
            result = result * 10 + (uint256(uint8(b[i])) - 0x30);
        }
    }

    function bytesToUint(bytes memory b) internal pure returns (uint256) {
        uint256 number = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Not a valid ASCII digit");
            number = number * 10 + (uint8(b[i]) - 0x30);
        }
        return number;
    }

    mapping(address => uint256) riddleScore;
    /// @notice OAO executes this method after it finishes with computation
    /// @param requestId id of the request
    /// @param output result of the OAO computation
    /// @param callbackData optional data that is executed in the callback
    function aiOracleCallback(
        uint256 requestId,
        bytes calldata output,
        bytes calldata callbackData
    ) external onlyAIOracleCallback {
        AIOracleRequest storage request = requests[requestId];
        require(request.sender != address(0), "request does not exist");
        bytes memory scoredoutput = output;
        response[request.sender] = output;
        uint256 num = bytesToUint(output);
        riddleScore[request.sender] = num;
        emit promptsUpdated(
            requestId,
            request.modelId,
            string(request.input),
            callbackData,
            scoredoutput
        );
    }

    /// @notice main point of interaction with OAO
    /// @dev aiOracle.requestCallback sends request to OAO
    function participateRiddle(
        uint256 modelId,
        string calldata answer
    ) external payable returns (uint256) {
        require(hasDeposited[msg.sender], "need to deposit first");
        require(!hasEntered[msg.sender], "Already entered the contest");
        string memory prompt = string(
            abi.encodePacked(
                "Riddle: \n",
                riddleTheme,
                "\n",
                "riddle answer: ",
                answer,
                "\n",
                "Task: Score the answer similar to riddle solution\n",
                "Scale:Just  1 to 10 (1=not related to answer,10=correct solution for given riddle)\n",
                "Instructions: Respond with only a single number between 1-10 "
            )
        );
        bytes memory input = bytes(prompt);
        uint256 requestId = aiOracle.requestCallback{value: msg.value}(
            modelId,
            input,
            address(this),
            callbackGasLimit[modelId],
            ""
        );
        AIOracleRequest storage request = requests[requestId];
        request.input = input;
        request.sender = msg.sender;
        request.modelId = modelId;
        hasEntered[msg.sender] = true;
        emit promptRequest(requestId, msg.sender, modelId, prompt);
        return requestId;
    }

    function claimPrize() external {
        require(
            riddleScore[msg.sender] > scoreToWin,
            "didnt score for requiredToWin"
        );
        uint256 prize = prizePool;
        prizePool = 0;
        (bool success, ) = msg.sender.call{value: prize}("");
        require(success, "Transfer failed");
    }
}
