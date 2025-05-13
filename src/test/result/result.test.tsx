import { test, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { mockServer, renderInContext } from "wasp/client/test/index";
import { mockResult } from "../mock";

// 👇 MOCK BEFORE IMPORTING THE COMPONENT THAT USES IT
vi.mock("../../playground/client/components/result/CandlePlot", () => ({
    default: () => <div data-testid="mocked-candle-plot">Mocked CandlePlot</div>,
}));
import ResultPage from "../../result/client/ResultPage";
import { getResults } from "wasp/client/operations";
import { ResultWithStrategyName } from "../../shared/sharedTypes";

const { mockQuery } = mockServer();

// string constants and error messages
const noResultMessage = "No results found. Create one by running a strategy and saving the result.";
const firstResult: ResultWithStrategyName = { ...mockResult, strategyName: "strategy_1" };
const secondResult = { ...firstResult, id: "red124", name: "result_2", pl: 10 };
const firstResultPl = new RegExp(firstResult.pl?.toFixed(2) + "%", 'i');
const secondResultPl = new RegExp(secondResult.pl?.toFixed(2) + "%", 'i');
const averagePl = new RegExp(((firstResult.pl as number + secondResult.pl as number) / 2).toFixed(2) + "%", 'i');
const warning = new RegExp("Undefined values for \"profit/loss\" in one or more results. These null values were set to 0 for the stats listed below.", 'i');

const toggleGroupByParent = async () => {
    const checkbox = screen.getByTestId("group-by-parent");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
};

test("shows empty state when no results", async () => {
    mockQuery(getResults, []);
    renderInContext(<ResultPage />);
    await screen.findByText(noResultMessage);
    expect(screen.getByText(noResultMessage)).toBeInTheDocument();
});

test("renders multiple results from API", async () => {
    mockQuery(getResults, [firstResult, secondResult]);
    renderInContext(<ResultPage />)

    await screen.findByText(firstResult.name);
    await screen.findByText(secondResult.name);
    await screen.findByText(firstResultPl);
    await screen.findByText(secondResultPl);

    expect(screen.getByText(firstResult.name)).toBeInTheDocument();
    expect(screen.getByText(secondResult.name)).toBeInTheDocument();
    expect(screen.getByText(firstResultPl)).toBeInTheDocument();
    expect(screen.getByText(secondResultPl)).toBeInTheDocument();
});

test("grouping is disabled for single strategy", async () => {
    mockQuery(getResults, [firstResult]);
    renderInContext(<ResultPage />)

    await screen.findByText(firstResult.name);
    expect(screen.getByText(firstResult.name)).toBeInTheDocument();

    await toggleGroupByParent();
    const seeMoreButton = screen.getByTestId("see-more-button");
    expect(seeMoreButton).toBeDisabled();
});

test("grouping is enabled for multiple strategies", async () => {
    mockQuery(getResults, [firstResult, secondResult]);
    renderInContext(<ResultPage />)

    await screen.findByText(firstResult.name);
    expect(screen.getByText(firstResult.name)).toBeInTheDocument();

    await toggleGroupByParent();
    const seeMoreButton = screen.getByTestId("see-more-button");
    expect(seeMoreButton).toBeEnabled();
    if (seeMoreButton) fireEvent.click(seeMoreButton);

    await screen.findByText("Average P/L");
    const matches = screen.getAllByText(averagePl);
    expect(matches).toHaveLength(2);
});

test("shows warning for null P/L values", async () => {
    const result2 = { ...firstResult, id: "red124", name: "result_2", pl: 10 };
    const result3 = { ...firstResult, id: "red125", name: "result_3", pl: null };

    mockQuery(getResults, [firstResult, result2, result3]);
    renderInContext(<ResultPage />)

    await screen.findByText(firstResult.name);
    expect(screen.getByText(firstResult.name)).toBeInTheDocument();
    await toggleGroupByParent();

    const seeMoreButton = screen.getByTestId("see-more-button");
    expect(seeMoreButton).toBeEnabled();
    if (seeMoreButton) fireEvent.click(seeMoreButton);

    await screen.findByText(warning);
    expect(screen.getByText(warning)).toBeInTheDocument();
    
    const warningPl = new RegExp(((firstResult.pl as number + result2.pl as number) / 3).toFixed(2) + "%", 'i');
    await screen.findByText("Average P/L");
    const matches = screen.getAllByText(warningPl);
    expect(matches).toHaveLength(4);
});
