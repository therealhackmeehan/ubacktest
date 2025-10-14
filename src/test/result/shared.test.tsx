import { test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { getShared } from "wasp/client/operations";
import { mockServer, renderInContext } from "wasp/client/test/index";
import { mockSharedResult, mockUser, mockResult } from "../mock";

vi.mock("../../playground/client/components/result/CandlePlot", () => ({
  default: () => <div data-testid="mocked-candle-plot">Mocked CandlePlot</div>,
}));
import SharedList from "../../result/client/components/SharedList";
const { mockQuery } = mockServer();

// string constants and error messages
const noShareMessage =
  "No results found. If someone were to share a result with you, it would appear here.";
const sharedUserName = mockUser.email?.split("@")[0] ?? "unknown";
const sharedTextRegex = new RegExp(
  `@${sharedUserName}\\s+sent you a result`,
  "i",
);
const fromSharedRegex = new RegExp(`from @${sharedUserName}`, "i");
const accept = "Accept";
const deny = "Deny";
const cancel = "Cancel";
const confirm = "Confirm";
const profitLoss = new RegExp(mockResult.pl?.toFixed(2) + "%", "i");
const areYouSure = /Are you sure you'd like to remove yourself/i;

test("renders a 'no shares' message when no shares available", async () => {
  mockQuery(getShared, []);
  renderInContext(<SharedList />);
  await screen.findByText(noShareMessage);
  expect(screen.getByText(noShareMessage)).toBeInTheDocument();
});

test("renders unaccepted strategy", async () => {
  mockQuery(getShared, [mockSharedResult]);
  renderInContext(<SharedList />);
  await screen.findByText(accept);
  await screen.findByText(deny);
  await screen.findByText(sharedTextRegex);
  expect(screen.getByText(accept)).toBeInTheDocument();
  expect(screen.getByText(deny)).toBeInTheDocument();
  expect(screen.getByText(sharedTextRegex)).toBeInTheDocument();
});

test("renders unaccepted strategy and launches modal when deny is pressed", async () => {
  mockQuery(getShared, [mockSharedResult]);
  renderInContext(<SharedList />);
  await screen.findByText(accept);
  await screen.findByText(deny);
  await screen.findByText(sharedTextRegex);
  expect(screen.getByText(accept)).toBeInTheDocument();
  expect(screen.getByText(deny)).toBeInTheDocument();
  expect(screen.getByText(sharedTextRegex)).toBeInTheDocument();

  const denyButton = screen.getByText(deny);
  fireEvent.click(denyButton);

  await screen.findByText(areYouSure);
  expect(screen.getByText(areYouSure)).toBeInTheDocument();

  await screen.findByText(cancel);
  await screen.findByText(confirm);
  expect(screen.getByText(cancel)).toBeInTheDocument();
  expect(screen.getByText(confirm)).toBeInTheDocument();
});

const acceptedMockSharedResult = { ...mockSharedResult, accepted: true };
test("renders accepted strategy", async () => {
  mockQuery(getShared, [acceptedMockSharedResult]);
  renderInContext(<SharedList />);
  await screen.findByText(mockResult.name);
  await screen.findByText(fromSharedRegex);
  await screen.findByText(profitLoss);
  expect(screen.getByText(mockResult.name)).toBeInTheDocument();
  expect(screen.getByText(fromSharedRegex)).toBeInTheDocument();
  expect(screen.getByText(profitLoss)).toBeInTheDocument();
});
