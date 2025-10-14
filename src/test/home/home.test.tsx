import { test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { mockServer, renderInContext } from "wasp/client/test";
import { getStrategies } from "wasp/client/operations";
import { mockStrategy } from "../mock";

import HomePage from "../../home/HomePage";
const { mockQuery } = mockServer();

const secondMockStrategy = { ...mockStrategy, id: "12346", name: "strategy_2" };
const mockStrategies = [mockStrategy, secondMockStrategy];

test("renders strategies from mock API", async () => {
  mockQuery(getStrategies, mockStrategies);
  renderInContext(<HomePage />);
  await screen.findByText(mockStrategy.name);
  await screen.findByText(secondMockStrategy.name);
  expect(screen.getByText(mockStrategy.name)).toBeInTheDocument();
  expect(screen.getByText(secondMockStrategy.name)).toBeInTheDocument();
});

test("opens new strategy modal when clicking 'new' button", async () => {
  mockQuery(getStrategies, null);
  renderInContext(<HomePage />);
  const newButton = screen.getByRole("button", { name: /new/i });
  fireEvent.click(newButton);
  await screen.findByText(/create new/i);
});

test("opens delete confirmation modal when pressing the trash icon", async () => {
  mockQuery(getStrategies, [mockStrategy]);
  renderInContext(<HomePage />);
  await screen.findByText(mockStrategy.name);
  const deleteButton = screen.getByTitle("Delete Strategy");
  fireEvent.click(deleteButton);
  await screen.findByText(/Are you sure you'd like to delete/i);
});

test("opens rename modal when pressing the edit icon", async () => {
  mockQuery(getStrategies, [mockStrategy]);
  renderInContext(<HomePage />);
  await screen.findByText(mockStrategy.name);
  const renameButton = screen.getByTitle("Rename Strategy");
  fireEvent.click(renameButton);
  await screen.findByText(/Rename Your/i);
});

test("shows fallback text when no strategies", async () => {
  mockQuery(getStrategies, null);
  renderInContext(<HomePage />);
  await screen.findByText("No strategies found. Create one now!");
});
