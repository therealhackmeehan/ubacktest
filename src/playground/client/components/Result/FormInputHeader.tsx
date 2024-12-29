import { FormInputProps } from "../../../../shared/sharedTypes";

function FormInputHeader({formInputs}: {formInputs: FormInputProps}) {

    return (
        <div className="col-span-1 flex flex-col justify-between gap-x-2 bg-slate-100 p-4">
            <div className="p-2">
                <div className="font-extralight text-sm flex justify-between items-center">
                    started <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.startDate}</span>
                </div>
                <div className="font-extralight text-sm flex justify-between items-center">
                    ended <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.endDate}</span>
                </div>
                <div className="font-extralight text-sm flex justify-between items-center">
                    trading frequency <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.intval}</span>
                </div>
            </div>
            <div className="scale-90 p-2 opacity-80">
                <div className="font-extralight text-sm flex justify-between items-center">
                    trading cost @ <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.costPerTrade}%</span>
                </div>
                <div className="font-extralight text-sm flex justify-between items-center">
                    trades executed @ <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.timeOfDay}</span>
                </div>
            </div>
        </div>
    )
}

export default FormInputHeader;