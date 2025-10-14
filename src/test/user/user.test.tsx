import { test, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderInContext } from "wasp/client/test";
import AccountPage from "../../user/AccountPage";
import { mockUser } from "../mock";

test("renders user account page with correct info", async () => {
  renderInContext(<AccountPage user={mockUser} />);
  await screen.findByText("Email address");
  await screen.findByText("Your Plan");
  expect(screen.getByText(mockUser.email as string)).toBeInTheDocument();

  const formattedPlan =
    String(mockUser.subscriptionPlan).charAt(0).toUpperCase() +
    String(mockUser.subscriptionPlan).slice(1);
  expect(screen.getByText(formattedPlan)).toBeInTheDocument();
});
