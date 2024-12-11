import { FiDelete, FiEdit } from 'react-icons/fi';
import { type Result } from 'wasp/entities';

export default function ResultDropDown({result}: {result: Result}) {

    return (
        <div className='flex justify-between m-4 p-2 rounded-lg bg-slate-100' onClick={() => console.log('hi')}>
            <div className='flex justify-between'>
                <div className='tracking-tight text-xl'>
                    {result.name}
                </div>
                <div className='text-slate-400 text-sm'>
                    from strategy: {result.fromStrategyID}
                </div>
            </div>
            <div className='flex justify-between'>
                <div>
                    saved: {result.createdAt.toLocaleDateString()}
                </div>
                <FiDelete />
                <FiEdit  />
                <div className='rounded-md font-extrabold bg-white hover:bg-slate-300'>
                    VIEW
                </div>
            </div>
        </div>
    )

}