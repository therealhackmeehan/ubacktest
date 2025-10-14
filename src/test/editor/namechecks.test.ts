import { describe, it, expect } from "vitest";
import { validateNewName } from "../../playground/client/scripts/modalHelpers";

describe("New Name Validation", () => {
  it("Should throw an error for names that are too short", () => {
    expect(() => validateNewName("ab")).toThrow(
      "Project name must be at least 3 characters long.",
    );
  });

  it("Should throw an error for names that are too long", () => {
    expect(() => validateNewName("a".repeat(26))).toThrow(
      "Project name must be no more than 25 characters long.",
    );
  });

  it("Should throw an error for names with invalid characters", () => {
    const invalidNames = ["Test Name", "Invalid@Name", "123!Test"];
    invalidNames.forEach((name) => {
      expect(() => validateNewName(name)).toThrow(
        "Project name can only contain letters, numbers, underscores, and hyphens.",
      );
    });
  });

  it("Should throw an error for names with leading or trailing spaces", () => {
    expect(() => validateNewName(" Name")).toThrow(
      "Project name cannot start or end with whitespace.",
    );
    expect(() => validateNewName("Name ")).toThrow(
      "Project name cannot start or end with whitespace.",
    );
  });
});
