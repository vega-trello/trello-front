import { createAlertDialog } from "../../../shared";

export const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<>
			Удаление колонки повлечет за собой удаление <b>ВСЕХ</b> карточек, которые
			находятся в ней
		</>
	),
});
