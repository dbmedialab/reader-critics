//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

// tslint:disable max-file-line-count
import * as React from 'react';

import ArticleItemType from 'base/ArticleItemType';

import DynamicList from 'front/component/DynamicList';
import { FormattedMessage } from 'react-intl';

export interface EditFormPayload {
	text : string;
	comment : string;
	links : string[];
}

export interface ArticleEditFormProp {
	/** The ID of this item. It's used to create references for labels to text areas and inputs */
	id : number;
	/** Funciton to trigger so input is reset */
	onCancel : Function;
	/** Funciton to trigger so component's state is sent to parrent Article component */
	onSave : Function;
	/** The text of the element, be it title, paragraph, lead etc. */
	originalText: string;
	/** The type of the content, e.g. title, subtitle, paraghrap etc */
	type: ArticleItemType;
}

export interface ArticleEditFormState {
	current : EditFormPayload;
	previous : EditFormPayload;
}

export default class ArticleEditForm
extends React.Component <ArticleEditFormProp, ArticleEditFormState>
{
	private textArea : any;
	private commentArea : any;
	private linkInput : any;

	constructor(props : ArticleEditFormProp) {
		super(props);

		const initial : EditFormPayload = {
			text: props.originalText,
			comment: '',
			links: [],
		};

		this.state = {
			current: initial,
			previous: initial,
		};
	}

	public getCurrentData() : EditFormPayload {
		return this.state.current;
	}

	public reset(originalText : string) {
		const clean : EditFormPayload = {
			text: originalText,
			comment: '',
			links: [],
		};

		this.textArea.value = originalText;
		this.commentArea.value = '';

		this.setState({
			current: clean,
			previous: clean,
		});
	}

	public render() {
		return <form>
			<fieldset className="text">
				<label htmlFor={this.FieldId('content')}>
					<FormattedMessage id="button.edit"/> {this.Translate(this.props.type)}
				</label>
				<textarea
					onKeyUp={() => this.UpdateState('text', this.textArea)}
					ref={r => this.textArea = r}
					defaultValue={this.state.current.text}
					rows={3}
					id={this.FieldId('content')}
				/>
			</fieldset>
			<fieldset className="comment">
				<label htmlFor={this.FieldId('comment')}>
					<FormattedMessage id="label.article-el.editComment"/>
				</label>
				<textarea
					onKeyUp={()=>this.UpdateState( 'comment', this.commentArea )}
					ref={r => this.commentArea = r}
					rows={3}
					id={this.FieldId('comment')}
				/>
			</fieldset>
			<fieldset className="link">
				<label htmlFor={this.FieldId('link')}><FormattedMessage id="label.article-el.addLinks"/></label>
				<DynamicList
					items={this.state.current.links}
					onRemove={this.RemoveLinkItem.bind(this)}
				/>
				<input
					ref={(r) => this.linkInput = r}
					id={this.FieldId('link')}
					type="text"
					onKeyDown={(e)=> e.keyCode === 13 ? this.AddLinkItem(e) : null}
				/>
			</fieldset>
			<fieldset className="actions">
				<a onClick={(e)=>this.onCancel(e)} className="button cancel">
					<FormattedMessage id="button.cancel"/>
				</a>
				<a onClick={(e)=>this.onSave(e)} className="button save">
					<FormattedMessage id="button.save"/>
				</a>
			</fieldset>
		</form>;
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const newState = this.state;
		newState.current[field] = ref.value;
		this.setState(newState);
	}

	// @param {string} type
	// Helper class to create unique ID for lables in form.
	private FieldId(type : string) {
		return `edit-field-${this.props.id}-${type}`;
	}

	// @param {number} index
	// Removes the supplied index from the states link-list.
	// Component renders news state and gives each item a new index.
	private RemoveLinkItem(index : number) {
		const link = this.state.current.links;
		const current : EditFormPayload = this.state.current;

		// TODO do this with Array.splice() instead
		current.links = [ ...link.slice( 0, index ), ...link.slice( index + 1 )];

		this.setState({
			current,
		});
	}

	// @param {event} e
	// Resets the components state to that of its initial props.
	// Clears inputfeilds and calls the onCancle funciton for the
	// parent component so it can collaps the edit feild.
	private onCancel(e : any) {
		e.stopPropagation();

		this.textArea.value = this.state.previous.text;
		this.commentArea.value = this.state.previous.comment;

		this.setState({
			current: this.state.previous,
		}, () => this.props.onCancel(this.state));
	}

	// @param {event} e
	// Takes an event so it can stop bubbling in the dom.
	// Adds the current input to the link feild
	// Triggers the parrent onSave method to update state.
	private onSave(e : any) {
		e.stopPropagation();

		if (this.linkInput.value) {
			this.AddLinkItem();
		}

		this.props.onSave(this.state.current);
	}

	// @param {event} e optional
	// Adds the content of the linkinput feild to the component link state
	// resets the input
	private AddLinkItem(e? : any) {
		if (e) {
			e.preventDefault();
		}
		if (!this.linkInput.value) {
			return;
		}

		const current : EditFormPayload = this.state.current;
		current.links.push(this.linkInput.value);

		this.setState({
			current,
		}, () => {
			this.linkInput.value = '';
		});
	}

	// Helper to translate component type to native language.
	private Translate(type: string): JSX.Element {
		const lookup = {
			lead: <FormattedMessage id="label.article-el.introduction"/>,
			title: <FormattedMessage id="label.article-el.maintitle"/>,
			paragraph: <FormattedMessage id="label.article-el.paragraphEmpty"/>,
		};

		return lookup [ type ] ? lookup [ type ] : 'tekst';
	}

}
