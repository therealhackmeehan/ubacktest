interface Text {
    text: string;
}
function ToolTip({text}: Text) {
    return (
        <div className="p-1 mx-3 opacity-75 duration-700 bg-white text-gray-800 rounded-md border-2 font-xs hover:scale-110">
            {text}
        </div>
    )
}

export default ToolTip;