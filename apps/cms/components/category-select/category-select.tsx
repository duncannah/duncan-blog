import { Category } from "@prisma/client";
import React from "react";
import { APICall } from "../../util/fetch";
import toast from "react-hot-toast";

import styles from "./category-select.module.scss";

/* eslint-disable-next-line */
export interface CategorySelectProps {
	selected: string[];
	onChange: (categories: string[]) => void;
}

export function CategorySelect({ selected, onChange }: CategorySelectProps) {
	const [categories, setCategories] = React.useState<string[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchCategories() {
			setIsLoading(true);

			return APICall.get<Category[]>(`categories`)
				.then((categories) => setCategories(categories.map((category) => category.name)))
				.catch((e: Error) => toast.error(`Error fetching categories: ${e.message}`))
				.finally(() => setIsLoading(false));
		}

		void fetchCategories();
	}, []);

	const addCategory = (category: string) => {
		onChange([...selected, category]);
	};

	const newCategory = () => {
		let newCategory = prompt(`New category name`);

		if (newCategory) {
			newCategory = newCategory.trim().toLowerCase().replace(/\s+/g, `-`);

			if (!categories.includes(newCategory)) setCategories((categories) => [...categories, newCategory || ``]);

			addCategory(newCategory);
		}
	};

	return (
		<div className={styles[`container`]}>
			{isLoading ? (
				<div>{`Loading...`}</div>
			) : (
				<>
					{!!selected.length && (
						<div className={styles[`selected`]}>
							{selected.map((category) => (
								<div key={category}>
									{category}
									<span className={styles[`remove`]} onClick={() => onChange(selected.filter((c) => c !== category))}>{`X`}</span>
								</div>
							))}
						</div>
					)}

					<select name={``} id={``} onChange={(e) => addCategory(e.target.value)}>
						<option value={``}>{`-`}</option>
						{categories
							.filter((c) => !selected.includes(c))
							.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
					</select>
					<button type={`button`} onClick={newCategory}>{`+`}</button>
				</>
			)}
		</div>
	);
}

export default CategorySelect;
