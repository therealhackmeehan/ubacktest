import { test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderInContext } from "wasp/client/test/index";
import { mockStrategy, mockUser } from "../mock";
import { StrategyContext } from "../../playground/client/EditorPage";

// 👇 MOCK BEFORE IMPORTING THE COMPONENT THAT USES IT
vi.mock("../../playground/client/components/result/CandlePlot", () => ({
  default: () => <div data-testid="mocked-candle-plot">Mocked CandlePlot</div>,
}));
import StrategyHeader from "../../playground/client/components/editor/StrategyHeader";

function renderWithStrategyContext(ui: any, strategy = mockStrategy) {
  return renderInContext(
    <StrategyContext.Provider
      value={{ selectedStrategy: strategy, setSelectedStrategy: vi.fn() }}
    >
      {ui}
    </StrategyContext.Provider>
  );
}

test("renders correct strategy name in strategy header", async () => {
  renderWithStrategyContext(<StrategyHeader />);
  await screen.findByText(mockStrategy.name);
  expect(screen.getByText(mockStrategy.name)).toBeInTheDocument();
});

const freeUser = { ...mockUser, subscriptionPlan: null };
test("renders number of strategies left IF NOT SUBSCRIBED", async () => {
  renderWithStrategyContext(<StrategyHeader />);
  await screen.findByText(mockStrategy.name);
  expect(screen.getByText(mockStrategy.name)).toBeInTheDocument();
  await screen.findByText("tests remaining");
  expect(screen.getByText("tests remaining")).toBeInTheDocument();
});

// HOW CAN I MOCK A SPECIFIC USER??
// test("does not render number of remaining strategies IF SUBSCRIBED", async () => {
//   // mockQuery(useAuth, mockUser);
//   renderWithStrategyContext(<StrategyHeader />);
//   await screen.findByText(mockStrategy.name);
//   expect(screen.getByText(mockStrategy.name)).toBeInTheDocument();
//   expect(screen.queryByText("tests remaining")).not.toBeInTheDocument();
// });
