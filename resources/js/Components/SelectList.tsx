import { Dispatch, SetStateAction } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';

export function SelectList({
    label,
    onSelectValueChangeHandler,
    initSelectValue,
    isDisabled,
    optionList,
    name,
    placeholder,
    selectOptionValuePropCode,
    selectOptionValuePropToDisplay,
}: {
    label: string;
    onSelectValueChangeHandler: Dispatch<SetStateAction<string>>;
    initSelectValue: string;
    isDisabled: boolean;
    optionList: any[];
    name: string;
    placeholder: string;
    selectOptionValuePropCode: string;
    selectOptionValuePropToDisplay: string;
}) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <Select
                onValueChange={onSelectValueChangeHandler}
                value={initSelectValue}
                disabled={isDisabled}
                name="winner_id"
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {optionList.map((item) => {
                        return (
                            <SelectItem
                                key={item[selectOptionValuePropCode]}
                                value={item[
                                    selectOptionValuePropCode
                                ].toString()}
                            >
                                {item[selectOptionValuePropToDisplay]}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
