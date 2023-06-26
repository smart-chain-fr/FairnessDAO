// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {MockTrevi} from "../../contracts/Mocks/MockTrevi.sol";
import {MockERC20} from "../../contracts/Mocks/MockERC20.sol";

contract TreviStakingFunctionalTest is Test {
    MockTrevi token;
    MockERC20 mockToken;

    address callerUserA = makeAddr("callerUserA");
    address callerUserB = makeAddr("callerUserB");
    address callerUserC = makeAddr("callerUserC");

    event Transfer(address indexed from, address indexed to, uint256 amount);

    function setUp() public {
        token = new MockTrevi("TREVI", "TREVI", 18, 1);
        mockToken = new MockERC20("MOCK", "MOCK", 10**18);

        token.setToken(address(mockToken));
    }

    function testFuzz_streamSingleUser_func(uint128 amountUserA) public {
        vm.warp(1_687_762_587);

        deal(address(mockToken), callerUserA, amountUserA);

        assertEq(mockToken.balanceOf(callerUserA), amountUserA);

        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);

        token.startDripping(callerUserA, amountUserA);

        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(callerUserA), 0);

        vm.warp(1_687_762_588);

        token.stopDripping(callerUserA, amountUserA);
    }

    function testFuzz_streamSingleUserOneMonth_func(uint128 amountUserA)
        public
    {
        vm.warp(1_685_084_187);

        deal(address(mockToken), callerUserA, amountUserA);

        assertEq(mockToken.balanceOf(callerUserA), amountUserA);

        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);

        token.startDripping(callerUserA, amountUserA);

        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(callerUserA), 0);

        vm.warp(1_687_762_587);

        token.stopDripping(callerUserA, amountUserA);
    }

    function testFuzz_streamSingleUserMultipleTimes_func(uint128 amountUserA)
        public
    {
        vm.warp(1_687_762_587);

        deal(address(mockToken), callerUserA, amountUserA);

        assertEq(mockToken.balanceOf(callerUserA), amountUserA);

        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);

        token.startDripping(callerUserA, amountUserA);

        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(callerUserA), 0);

        vm.warp(1_687_848_987); // One day later

        token.stopDripping(callerUserA, amountUserA);

        vm.warp(1_687_935_387); // One day later
        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);

        token.startDripping(callerUserA, amountUserA);

        vm.warp(1_688_021_787); // One day later

        token.stopDripping(callerUserA, amountUserA);
    }

    function testFuzz_streamTwoUsers_func_withRevert_arithmeticOverflow(
        uint128 amountUserA,
        uint128 amountUserB
    ) public {
        vm.warp(1_687_762_587);

        deal(address(mockToken), callerUserA, amountUserA);
        deal(address(mockToken), callerUserB, amountUserB);

        assertEq(mockToken.balanceOf(callerUserA), amountUserA);
        assertEq(mockToken.balanceOf(callerUserB), amountUserB);

        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);
        token.startDripping(callerUserA, amountUserA);
        startHoax(callerUserB);
        mockToken.approve(address(token), amountUserB);
        token.startDripping(callerUserB, amountUserB);

        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(callerUserA), 0);
        assertEq(token.balanceOf(callerUserB), 0);

        vm.warp(1_687_762_588);

        // Overflows

        // token.stopDripping(callerUserA, amountUserA);
        // token.stopDripping(callerUserB, amountUserB);
    }

    function testFuzz_streamMultipleUsers_func_withRevert_arithmeticOverflow(
        uint128 amountUserA,
        uint128 amountUserB,
        uint128 amountUserC
    ) public {
        vm.warp(1_687_762_587);

        deal(address(mockToken), callerUserA, amountUserA);
        deal(address(mockToken), callerUserB, amountUserB);
        deal(address(mockToken), callerUserC, amountUserC);

        assertEq(mockToken.balanceOf(callerUserA), amountUserA);
        assertEq(mockToken.balanceOf(callerUserB), amountUserB);
        assertEq(mockToken.balanceOf(callerUserC), amountUserC);

        startHoax(callerUserA);
        mockToken.approve(address(token), amountUserA);
        token.startDripping(callerUserA, amountUserA);
        startHoax(callerUserB);
        mockToken.approve(address(token), amountUserB);
        token.startDripping(callerUserB, amountUserB);
        startHoax(callerUserC);
        mockToken.approve(address(token), amountUserC);
        token.startDripping(callerUserC, amountUserC);

        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(callerUserA), 0);
        assertEq(token.balanceOf(callerUserB), 0);
        assertEq(token.balanceOf(callerUserC), 0);

        vm.warp(1_687_762_588);

        // Overflows

        // startHoax(callerUserA);
        // token.stopDripping(callerUserA, amountUserA);

        // startHoax(callerUserB);
        // token.stopDripping(callerUserB, amountUserB);

        // startHoax(callerUserC);
        // token.stopDripping(callerUserC, amountUserC);
    }
}
