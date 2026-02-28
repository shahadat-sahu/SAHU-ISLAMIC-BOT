module.exports.config = {
	name: "post",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SHAHADAT SAHU",
	description: "Create a new Facebook post",
	commandCategory: "admin",
	cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ event, api }) => {
	const { threadID, messageID, senderID } = event;
	const uuid = getGUID();

	const formData = {
		input: {
			composer_entry_point: "inline_composer",
			composer_source_surface: "timeline",
			idempotence_token: uuid + "_FEED",
			source: "WWW",
			attachments: [],
			audience: {
				privacy: {
					allow: [],
					base_state: "FRIENDS",
					deny: [],
					tag_expansion_state: "UNSPECIFIED"
				}
			},
			message: { ranges: [], text: "" },
			with_tags_ids: [],
			inline_activities: [],
			explicit_place_id: "0",
			text_format_preset_id: "0",
			logging: { composer_session_id: uuid },
			tracking: [null],
			actor_id: api.getCurrentUserID(),
			client_mutation_id: Math.floor(Math.random() * 1000)
		},
		displayCommentsFeedbackContext: null,
		displayCommentsContextEnableComment: null,
		displayCommentsContextIsAdPreview: null,
		displayCommentsContextIsAggregatedShare: null,
		displayCommentsContextIsStorySet: null,
		feedLocation: "TIMELINE",
		feedbackSource: 0,
		focusCommentID: null,
		gridMediaWidth: 230,
		groupID: null,
		scale: 3,
		privacySelectorRenderLocation: "COMET_STREAM",
		renderLocation: "timeline",
		useDefaultActor: false,
		inviteShortLinkKey: null,
		isFeed: false,
		isFundraiser: false,
		isFunFactPost: false,
		isGroup: false,
		isTimeline: true,
		isSocialLearning: false,
		isPageNewsFeed: false,
		isProfileReviews: false,
		isWorkSharedDraft: false,
		UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
		hashtag: null,
		canUserManageOffers: false
	};

	return api.sendMessage(
		"Choose audience:\n1. Everyone\n2. Friends\n3. Only Me",
		threadID,
		(e, info) => {
			global.client.handleReply.push({
				name: this.config.name,
				messageID: info.messageID,
				author: senderID,
				formData,
				type: "whoSee"
			});
		},
		messageID
	);
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
	if (event.senderID != handleReply.author) return;

	const axios = require("axios");
	const fs = require("fs-extra");
	const { threadID, messageID, attachments = [], body } = event;
	const botID = api.getCurrentUserID();

	if (handleReply.type === "whoSee") {
		if (!["1", "2", "3"].includes(body))
			return api.sendMessage("Please choose 1, 2 or 3", threadID, messageID);

		handleReply.formData.input.audience.privacy.base_state =
			body === "1" ? "EVERYONE" :
			body === "2" ? "FRIENDS" : "SELF";

		api.unsendMessage(handleReply.messageID);

		return api.sendMessage(
			"Reply with post content (reply 0 for empty)",
			threadID,
			(e, info) => {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					formData: handleReply.formData,
					type: "content"
				});
			},
			messageID
		);
	}

	if (handleReply.type === "content") {
		if (body !== "0") handleReply.formData.input.message.text = body;

		api.unsendMessage(handleReply.messageID);

		return api.sendMessage(
			"Send photo(s) or reply 0 to skip",
			threadID,
			(e, info) => {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					formData: handleReply.formData,
					type: "image"
				});
			},
			messageID
		);
	}

	if (handleReply.type === "image") {
		if (body !== "0" && attachments.length > 0) {
			for (let i = 0; i < attachments.length; i++) {
				if (attachments[i].type !== "photo") continue;

				const fileData = await axios.get(attachments[i].url, { responseType: "arraybuffer" });
				const filePath = __dirname + `/cache/post_${Date.now()}_${i}.png`;

				fs.writeFileSync(filePath, Buffer.from(fileData.data));

				const upload = await api.httpPostFormData(
					`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`,
					{ file: fs.createReadStream(filePath) }
				);

				let result = typeof upload === "string"
					? JSON.parse(upload.replace("for (;;);", ""))
					: upload;

				handleReply.formData.input.attachments.push({
					photo: { id: result.payload.fbid.toString() }
				});

				fs.unlinkSync(filePath);
			}
		}

		api.unsendMessage(handleReply.messageID);

		const form = {
			av: botID,
			fb_api_req_friendly_name: "ComposerStoryCreateMutation",
			fb_api_caller_class: "RelayModern",
			doc_id: "7711610262190099",
			variables: JSON.stringify(handleReply.formData)
		};

		return api.httpPost(
			"https://www.facebook.com/api/graphql/",
			form,
			(e, info) => {
				try {
					if (e) throw e;

					if (typeof info === "string")
						info = JSON.parse(info.replace("for (;;);", ""));

					const postID = info.data.story_create.story.legacy_story_hideable_id;
					const urlPost = info.data.story_create.story.url;

					return api.sendMessage(
						`Post created successfully\nPostID: ${postID}\nURL: ${urlPost}`,
						threadID,
						messageID
					);
				} catch {
					return api.sendMessage(
						"Post creation failed.",
						threadID,
						messageID
					);
				}
			}
		);
	}
};

function getGUID() {
	let sectionLength = Date.now();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		let r = Math.floor((sectionLength + Math.random() * 16) % 16);
		sectionLength = Math.floor(sectionLength / 16);
		return (c === "x" ? r : (r & 7) | 8).toString(16);
	});
}