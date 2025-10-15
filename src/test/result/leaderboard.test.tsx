import { test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { mockServer, renderInContext } from "wasp/client/test";
import {
  GetTopResultsProp,
  ResultWithUsername,
} from "../../shared/sharedTypes";
import { mockResult } from "../mock";
import { getTopResults } from "wasp/client/operations";

// 👇 MOCK BEFORE IMPORTING THE COMPONENT THAT USES IT
vi.mock("../../playground/client/components/result/CandlePlot", () => ({
  default: () => <div data-testid="mocked-candle-plot">Mocked CandlePlot</div>,
}));

import LeaderboardPage from "../../leaderboard/LeaderboardPage";

const { mockQuery } = mockServer();
const mockResultWithUserName: ResultWithUsername = {
  ...mockResult,
  email: "email1@gmail.com",
  pl: 7,
  cagr: 5,
};
const secondMockResultWithUsername: ResultWithUsername = {
  ...mockResult,
  email: "email2@gmail.com",
  pl: 14,
  cagr: 12,
};

const mockLeaderboard: GetTopResultsProp = {
  topByProfitLoss: [mockResultWithUserName, secondMockResultWithUsername],
  topByAnnualizedProfitLoss: [
    mockResultWithUserName,
    secondMockResultWithUsername,
  ],
};

test("renders leaderboard rows with correct order and data (sorted by p/l)", async () => {
  mockQuery(getTopResults, mockLeaderboard);
  renderInContext(<LeaderboardPage />);

  // Wait for both emails to appear
  const emailElements = await screen.findAllByText(/@email\d@gmail.com/);

  // Check correct order: email1 should come before email2
  expect(emailElements[0]).toHaveTextContent("email1@gmail.com");
  expect(emailElements[1]).toHaveTextContent("email2@gmail.com");

  // Also check corresponding PL and CAGR are in correct order
  const plElements = await screen.findAllByText(/%/); // crude but works if % is only in PL/CAGR
  const expectedPlOrder = [
    mockResultWithUserName.pl,
    secondMockResultWithUsername.pl,
  ];

  expect(plElements[1]).toHaveTextContent(
    (expectedPlOrder[0] as number).toFixed(2)
  );
  expect(plElements[3]).toHaveTextContent(
    (expectedPlOrder[1] as number).toFixed(2)
  );

  // Check that view buttons are present
  const viewButtons = await screen.findAllByRole("button", { name: /view/i });
  expect(viewButtons).toHaveLength(2);
});

test("renders leaderboard rows with correct order and data (sorted by cagr)", async () => {
  mockQuery(getTopResults, mockLeaderboard);
  renderInContext(<LeaderboardPage />);

  await screen.findByTestId("leaderboardtoggle");
  const switchButton = await screen.getByTestId("leaderboardtoggle");
  fireEvent.click(switchButton);

  const emailElements = await screen.findAllByText(/@email\d@gmail.com/);

  // Check correct order: email1 should come before email2
  expect(emailElements[0]).toHaveTextContent("email1@gmail.com");
  expect(emailElements[1]).toHaveTextContent("email2@gmail.com");

  // Also check corresponding PL and CAGR are in correct order
  const plElements = await screen.findAllByText(/%/); // crude but works if % is only in PL/CAGR
  const expectedCagrOrder = [
    mockResultWithUserName.cagr,
    secondMockResultWithUsername.cagr,
  ];

  expect(plElements[0]).toHaveTextContent(
    (expectedCagrOrder[0] as number).toFixed(2)
  );
  expect(plElements[2]).toHaveTextContent(
    (expectedCagrOrder[1] as number).toFixed(2)
  );

  // Check that view buttons are present
  const viewButtons = await screen.findAllByRole("button", { name: /view/i });
  expect(viewButtons).toHaveLength(2);
});
