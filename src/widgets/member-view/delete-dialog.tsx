import { createAlertDialog } from "../../shared";

export const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: "Удаление участника приведёт к его откреплению от всех карточек",
});
