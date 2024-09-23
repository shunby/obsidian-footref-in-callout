import { Decoration } from "@codemirror/view";
import { Plugin } from "obsidian";
import { around } from "monkey-around";

function makeFootrefHTML(tag: string) {
	const span1 = document.createElement("span");
	span1.className =
		"cm-footref  cm-formatting cm-formatting-link cm-formatting-link-start cm-barelink";
	span1.innerText = "[^";

	const span2 = document.createElement("span");
	span2.className = "cm-footref cm-hmd-barelink";
	span2.innerText = tag;

	const span3 = document.createElement("span");
	span3.className =
		"cm-footref  cm-formatting cm-formatting-link cm-formatting-link-end cm-barelink";
	span3.innerText = "]";

	return span1.outerHTML + span2.outerHTML + span3.outerHTML;
}

function modifyCallout(spec: Parameters<typeof Decoration.replace>[0]) {
	const widget: any = spec.widget;
	if (
		widget &&
		widget.clazz === "cm-callout" &&
		widget.text &&
		typeof widget.text === "string"
	) {
		const text: string = widget.text;
		widget.text = text.replace(/\[\^([^\]]+)\]/g, (_, tag) =>
			makeFootrefHTML(tag)
		);
	}
}

export default class FootrefPlugin extends Plugin {
	uninstaller: ReturnType<typeof around> | undefined;

	async onload() {
		this.uninstaller = around(Decoration, {
			replace(old) {
				return (spec) => {
					modifyCallout(spec);
					return old.call(this, spec);
				};
			},
		});
	}

	onunload() {
		if (this.uninstaller) {
			this.uninstaller();
		}
	}
}
