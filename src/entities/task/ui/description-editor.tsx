import {
	Control,
	RichTextEditor,
} from "../../../components/ui/rich-text-editor";
import {
	Subscript,
	Superscript,
} from "../../../components/ui/rich-text-editor-control";
import { Editor } from "@tiptap/react";

export type DescriptionEditor = {
	editor: Editor | null;
	defaultValue: string | undefined;
};

export function DescriptionEditor({ editor, defaultValue }: DescriptionEditor) {
	return (
		<RichTextEditor.Root editor={editor} defaultValue={defaultValue}>
			<RichTextEditor.Toolbar>
				<RichTextEditor.ControlGroup>
					<Control.H1 />
					<Control.H2 />
					<Control.H3 />
					<Control.H4 />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.Bold />
					<Control.Italic />
					<Control.Underline />
					<Control.Strikethrough />
					<Control.Code />
					<Subscript />
					<Superscript />
					<Control.TextColor />
					<Control.Link />
					<Control.ClearFormatting />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.AlignLeft />
					<Control.AlignCenter />
					<Control.AlignRight />
					<Control.AlignJustify />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.BulletList />
					<Control.OrderedList />
					<Control.TaskList />
					<Control.Blockquote />
					<Control.CodeBlock />
					<Control.HorizontalRule />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.InsertTable />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.Image />
				</RichTextEditor.ControlGroup>

				<RichTextEditor.ControlGroup>
					<Control.Undo />
					<Control.Redo />
				</RichTextEditor.ControlGroup>
			</RichTextEditor.Toolbar>
			<RichTextEditor.Content />
		</RichTextEditor.Root>
	);
}
