import { test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { mockServer, renderInContext } from "wasp/client/test";
import { getStrategies } from "wasp/client/operations";

import HomePage from "../../home/HomePage";

const { mockQuery } = mockServer();

const mockStrategies = [
  {
    id: '12345',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Mean Reversion",
    userId: '54321',
    code: "lol"
  },
  {
    id: '12345',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Momentum",
    userId: '54321',
    code: "lol2"
  },
];

test("renders strategies from mock API", async () => {
  mockQuery(getStrategies, mockStrategies);

  renderInContext(<HomePage />);

  // Wait for the mocked strategy names to appear
  await screen.findByText("Mean Reversion");
  await screen.findByText("Momentum");

  expect(screen.getByText("Mean Reversion")).toBeInTheDocument();
  expect(screen.getByText("Momentum")).toBeInTheDocument();
});

test("opens new strategy modal when clicking 'new' button", async () => {
  mockQuery(getStrategies, []);

  renderInContext(<HomePage />);

  const newButton = screen.getByRole("button", { name: /new/i });
  fireEvent.click(newButton);

  // Adjust this text if needed to match modal content
  await screen.findByText(/create strategy/i);
});

test("opens delete confirmation modal when pressing the trash icon", async() => {

});

test("opens rename modal when pressing the edit icon", async() => {

});

test("shows fallback text when no strategies", async () => {
  mockQuery(getStrategies, []);

  renderInContext(<HomePage />);

  await screen.findByText("No strategies found. Create one now!");
});
