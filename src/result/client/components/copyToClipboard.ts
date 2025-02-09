export const copyToClipboard = (codeToCopy: string | null) => {
    if (codeToCopy) {
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                alert('code successfully copied to clipboard.')
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard: ', err);
            });
    }
};

export default copyToClipboard;