export default function MainStatistics() {
    const exampleStat = '12.3%';

    return (
        <div>
            <div className='font-extrabold text-end tracking-tight p-2'>
                Results and Statistics
            </div>
            <StatBox stat={exampleStat} text='Sharpe Ratio' />
            <StatBox stat={exampleStat} text='Sortino Ratio' />
            <StatBox stat={exampleStat} text='Number of Trades' />
            <StatBox stat={exampleStat} text='Overall Profit/Loss' />
            <StatBox stat={exampleStat} text='Overall Profit/Loss (Annualized)' />
        </div>
    )
}

interface statBoxProps {
    stat: string;
    text: string;
}

function StatBox({ stat, text }: statBoxProps) {
    return (
        <div className='bg-gray-200 border-2 border-black rounded-lg p-2 m-1'>
            <div className="flex tracking-tight text-black font-bold gap-2">{text}</div>
            <div className='font-extralight text-end tracking-loose'>{stat}</div>
        </div>
    )
}