import { DatePicker, parseDate, Portal } from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";

export function DatetimePicker({
	value,
	setValue,
}: {
	value: string | undefined;
	setValue: (v: string | undefined) => void;
}) {
	const parsed = value ? [parseDate(value.split("T")[0])] : [];

	return (
		<DatePicker.Root
			locale="ru-RU"
			value={parsed}
			onValueChange={(e) => {
				if (e.value.length === 0) {
					setValue(undefined);
				} else {
					setValue(e.value[0].toDate("UTC").toISOString());
				}
			}}
			placeholder="дд.мм.гггг"
		>
			<DatePicker.Control>
				<DatePicker.Input />
				<DatePicker.IndicatorGroup>
					<DatePicker.Context>
						{(context) =>
							context.value.length > 0 ? (
								<DatePicker.ClearTrigger />
							) : (
								<DatePicker.Trigger>
									<LuCalendar />
								</DatePicker.Trigger>
							)
						}
					</DatePicker.Context>
				</DatePicker.IndicatorGroup>
			</DatePicker.Control>
			<Portal>
				<DatePicker.Positioner>
					<DatePicker.Content>
						<DatePicker.View view="day">
							<DatePicker.Header />
							<DatePicker.DayTable />
						</DatePicker.View>
						<DatePicker.View view="month">
							<DatePicker.Header />
							<DatePicker.MonthTable />
						</DatePicker.View>
						<DatePicker.View view="year">
							<DatePicker.Header />
							<DatePicker.YearTable />
						</DatePicker.View>
					</DatePicker.Content>
				</DatePicker.Positioner>
			</Portal>
		</DatePicker.Root>
	);
}
