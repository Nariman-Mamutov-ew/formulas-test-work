'use client';

import React, { KeyboardEventHandler } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { autocompletion } from '@codemirror/autocomplete';
import { useStore } from './store';
import { useGetSuggestions } from './client';

import { customComplitions, macroPlaceholders, withInternalPlaceholders } from "./plugins";

export default function Index() {
	const formula = useStore();

	const onChange = (val: string) => {
		console.log(val);
		formula.updateFormula(val);
	};

	const {
		data,
		//todo handle states
		error,
		isLoading
	} = useGetSuggestions();

	const handleEnterKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
		if (event.key === "Enter") {
			try {
				//todo implement calculation function
				event.preventDefault();
			} catch (E) {
				console.log(E);
			}
		}
	}

	return (
		<div
			style={{
				padding: 20,
			}}
		>
			<div
				style={{
					width: "100%",
				}}
			>
				{
					data &&
					<CodeMirror
						width="100%"
						height="30px"
						minWidth="250px"
						onChange={onChange}
						value={formula.value}
						indentWithTab={false}
						aria-multiline={false}
						aria-orientation="horizontal"
						onKeyDown={handleEnterKeyPress}
						extensions={[
							macroPlaceholders,
							withInternalPlaceholders,
							autocompletion({
								activateOnTyping: true,
								override: [
									customComplitions(data),
								]
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
	);

}
