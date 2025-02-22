export function validateNewName(newName: string): void {
    const trimmedName = newName.trim();
    const minLength = 3;
    const maxLength = 25;

    if (trimmedName.length < minLength) {
        throw new Error(`Project name must be at least ${minLength} characters long.`);
    }
    if (trimmedName.length > maxLength) {
        throw new Error(`Project name must be no more than ${maxLength} characters long.`);
    }

    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(trimmedName)) {
        throw new Error('Project name can only contain letters, numbers, underscores, and hyphens.');
    }

    if (trimmedName !== newName) {
        throw new Error('Project name cannot start or end with whitespace.');
    }

}
