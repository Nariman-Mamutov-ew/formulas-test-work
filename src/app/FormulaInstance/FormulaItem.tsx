'use client';

import { FC, KeyboardEventHandler, useState } from "react";
import { autocompletion } from '@codemirror/autocomplete';
import CodeMirror, { EditorState } from '@uiw/react-codemirror';

import { customComplitions, macroPlaceholders, withInternalPlaceholders } from "./plugins";

import { Tag } from "../client";
import useStore, { Formula } from "../store";

type FormulaItemProps = {
	formula: Formula;
	tags?: Array<Tag>;
}

export const FormulaItem: FC<FormulaItemProps> = ({
	formula,
	tags
}) => {
	const formulasStore = useStore();
	const [formulaResult, setFormulaResult] = useState<string | number>('');

	const onChange = (val: string) => {
		formulasStore.updateFormula({
			...formula,
			formulaValue: val,
		});
	};

	const calculateExpression = (expression: string): number => {
		const regex = /\[\[SUM\]\]\((\d+),\s*(\d+)\)/g;
		expression = expression.replace(regex, (_, x: string, y: string) => (parseInt(x) + parseInt(y)).toString());
		return eval(expression);
	}

	const handleEnterKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
		if (event.key === "Enter") {
			try {
				const result = calculateExpression(formula.formulaValue)
				setFormulaResult(result);
				event.preventDefault();
			} catch (E) {
				setFormulaResult("#Error")
				console.log(E);
			}
		}
	}

	const hanldeDeleteFormula = () => {
		formulasStore.deleteFormula(formula.id);
	};

	return (
		<div
			className="bg-white p-4"
		>
			<div className="flex items-center justify-between py-2 pl-5 pr-4 bg-gray-100">
				<div className="text-24">
					Result: {formulaResult}
				</div>
				<button
					onClick={hanldeDeleteFormula}
				>
					Delete
				</button>
			</div>
			<div
				className="p-4 border border-gray-300 bg-white"
			>
				<div
					className="items-center justify-between rounded-t border-b p-2 bg-gray-100 text-gray-900 border-gray-300"
				>
					{
						tags &&
						<CodeMirror
							width="100%"
							height="100%"
							minWidth="250px"
							onChange={onChange}
							indentWithTab={false}
							aria-multiline={false}
							value={formula.formulaValue}
							aria-orientation="horizontal"
							onKeyDown={handleEnterKeyPress}
							extensions={[
								macroPlaceholders,
								withInternalPlaceholders,
								autocompletion({
									activateOnTyping: true,
									override: [
										customComplitions(tags),
									]
								}),
								EditorState.transactionFilter.of(tr => {
									return tr.newDoc.lines > 1 ? [] : [tr]
								}),
							]}
							basicSetup={{
								foldGutter: false,
								lineNumbers: false,
								autocompletion: true,
								bracketMatching: true,
								highlightActiveLine: false,
								highlightActiveLineGutter: false,
							}}
						/>
					}
				</div>
			</div>
		</div>
	)
}