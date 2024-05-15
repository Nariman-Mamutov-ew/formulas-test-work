'use client';

import React from "react";

import { useStore } from './store';
import { FormulaItem } from './FormulaInstance/FormulaItem';
import { useGetSuggestions } from './client';

export default function Index() {
	const store = useStore();

	const {
		data,
		//todo handle states
		error,
		isLoading
	} = useGetSuggestions();

	const addNewFormula = () => {
		store.addNewFormula();
	};

	return (
		<div
			className="p-12"
		>
			<div
				className=" flex justify-between items-center"
			>
				<div
					className="text-20"
				>
					Formulas
				</div>
				<button
					className=""
					onClick={addNewFormula}
				>
					Add Formula
				</button>
			</div>
			{
				store.formulas.map((item) =>
					<FormulaItem
						tags={data}
						key={item.id}
						formula={item}
					/>
				)
			}
		</div>
	);

}
