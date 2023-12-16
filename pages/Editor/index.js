import createAlignmentPlugin from "@draft-js-plugins/alignment";
import createLinkPlugin from "@draft-js-plugins/anchor";
import createDividerPlugin from "@draft-js-plugins/divider";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createFocusPlugin from "@draft-js-plugins/focus";
import createHashtagPlugin from "@draft-js-plugins/hashtag";
import createImagePlugin from "@draft-js-plugins/image";
import createInlineToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/inline-toolbar";
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import createSideToolbarPlugin from "@draft-js-plugins/side-toolbar";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import createVideoPlugin from "@draft-js-plugins/video";
import createIframelyPlugin from "@jimmycode/draft-js-iframely-plugin";
import {
  AtomicBlockUtils,
  EditorState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useEffect, useRef, useState } from "react";

import {
  ArrowLeftOutlined,
  DashOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "@draft-js-plugins/alignment/lib/plugin.css";
import "@draft-js-plugins/anchor/lib/plugin.css";
import {
  BlockquoteButton,
  BoldButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from "@draft-js-plugins/buttons";
import "@draft-js-plugins/divider/lib/plugin.css";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import "@draft-js-plugins/focus/lib/plugin.css";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/linkify/lib/plugin.css";
import BlockTypeSelect from "@draft-js-plugins/side-toolbar";
import "@draft-js-plugins/side-toolbar/lib/plugin.css";
import "@jimmycode/draft-js-iframely-plugin/lib/plugin.css";
import { Button, Upload, message } from "antd";
import { RichUtils } from "draft-js";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { BiImage } from "react-icons/bi";
import { ImEmbed } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { toHTML } from "../../common";
import {
  addDraftData,
  addHtmlData,
  setBlogData,
} from "../../store/actions/blog";
import ImageStyles from "../../styles/ImageStyles.module.css";
import LinkStyles from "../../styles/LinkStyles.module.css";
import alignmentStyles from "../../styles/alignmentStyles.module.css";
import classNames from "../../styles/blog.module.css";
import createColorBlockPlugin from "./ColorBlockPlugin";
import CustomSideToolbar from "./CustomSideToolbar";

const linkPlugin = createLinkPlugin({
  theme: LinkStyles,
  placeholder: "http://…",
});

const DefaultBlockTypeSelect = ({ getEditorState, setEditorState, theme }) => (
  <BlockTypeSelect
    getEditorState={getEditorState}
    setEditorState={setEditorState}
    theme={theme}
    structure={[iframelyPlugin.EmbedButton]}
  />
);

const inlineToolbarPlugin = createInlineToolbarPlugin();
const sideToolbarPlugin = createSideToolbarPlugin({
  structure: [DefaultBlockTypeSelect],
});

const dividerPlugin = createDividerPlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();
const textAlignmentPlugin = createTextAlignmentPlugin({
  theme: { alignmentStyles },
});
const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  alignmentPlugin.decorator,
  blockDndPlugin.decorator
);
const colorBlockPlugin = createColorBlockPlugin({ decorator });
const videoPlugin = createVideoPlugin({ decorator });

const imagePlugin = createImagePlugin({
  theme: ImageStyles,
  decorator,
});

const linkifyPlugin = createLinkifyPlugin();
const hashtagPlugin = createHashtagPlugin();
const iframelyPlugin = createIframelyPlugin({
  options: {
    apiKey: "ddff8c23f51320518007ff",
    handleOnReturn: true,
    handleOnPaste: true,
  },
});
const { InlineToolbar } = inlineToolbarPlugin;
const { AlignmentTool } = alignmentPlugin;

const plugins = [
  inlineToolbarPlugin,
  linkPlugin,
  sideToolbarPlugin,
  imagePlugin,
  linkifyPlugin,
  dividerPlugin,
  iframelyPlugin,
  hashtagPlugin,
  focusPlugin,
  colorBlockPlugin,
  alignmentPlugin,
  resizeablePlugin,
  textAlignmentPlugin,
  blockDndPlugin,
  videoPlugin,
  iframelyPlugin,
];

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === "blockquote") {
    return "superFancyBlockquote";
  }
}

function MediumEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [openSideBar, setOpenSideBar] = useState(false);
  const [placeholder, setPlaceholder] = useState("Tell your story...");
  const data = useSelector((state) => state.editor.blogData);
  const draft = useSelector((state) => state.editor.draft);
  const htmlData = useSelector((state) => state.editor.blogHtmlData);
  const dispatch = useDispatch();
  const router = useRouter();
  const editor = useRef(null);
  const inputRef = useRef(null);
  const focus = () => {
    editor.current?.focus();
  };

  const checkEditor =
    (Object.keys(data).length > 0 &&
      data?.blocks[0].text !== "" &&
      data.blocks.length >= 1) ||
    (Object.keys(data).length > 0 && data?.blocks[0].type === "image");

  const checkDraft =
    (draft?.draft_contents &&
      Object.keys(draft?.draft_contents).length > 0 &&
      draft?.draft_contents?.blocks[0].text !== "" &&
      draft?.draft_contents.blocks.length >= 1) ||
    (draft?.draft_contents &&
      Object.keys(draft?.draft_contents).length > 0 &&
      draft?.draft_contents?.blocks[0].type === "image");

  useEffect(() => {
    if (draft && Object.keys(draft).length > 0) {
      setEditorState(EditorState.createWithContent(convertFromRaw(draft)));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, []);

  const onChange = (newEditorState) => {
    const oldContent = convertToRaw(editorState.getCurrentContent());
    const newContent = convertToRaw(newEditorState.getCurrentContent());
    setEditorState(newEditorState);
    if (_.isEqual(oldContent, newContent) === false) {
      let html = toHTML(newEditorState.getCurrentContent());
      dispatch(addHtmlData(html));
      dispatch(setBlogData(convertToRaw(newEditorState.getCurrentContent())));
    }
  };

  const sideBarActions = [
    {
      icon: <BiImage ref={inputRef} />,
      onClick: () => {
        inputRef.current.click();
      },
    },
    {
      icon: <ImEmbed />,
      onClick: () => {
        handleEmbedClick();
      },
    },
    {
      icon: <DashOutlined />,
      onClick: () => {
        handleDividerClick();
      },
    },
  ];
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (command === "backspace") {
      setPlaceholder("Tell us story");
    } else if (newState) {
      onChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleImageUpload = async (file) => {
    if (file) {
      getBase64(file.originFileObj, (url) => {
        const newEditorState = insertImage(editorState, url);
        onChange(newEditorState, "image");
        setOpenSideBar(false);
      });
    }
  };

  const insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  const handleSaveDraft = async () => {
    dispatch(addDraftData(data));
    message.success("Draft Saved Successfully");
  };

  const onPublish = () => {
    router.push("/renderhtml");
  };

  const insertDivider = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "divider",
      "IMMUTABLE",
      {}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  const handleDividerClick = () => {
    const newEditorState = insertDivider(editorState);
    onChange(newEditorState);
    setOpenSideBar(false);
  };

  const handleEmbedClick = () => {
    setPlaceholder("Paste a link to embed content");
    setOpenSideBar(false);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        paddingTop: 90,
        paddingBottom: 50,
      }}
      className={classNames.blogEditor}
    >
      <div
        style={{
          width: "70%",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          gap: 80,
        }}
      >
        <ArrowLeftOutlined
          style={{ fontSize: 20 }}
          onClick={() => {
            router.back();
          }}
        />
        {draft && checkDraft ? (
          <div
            style={{
              fontSize: 14,
              color: "green",
            }}
          >
            Last Saved on - {moment(draft.updated_at).format("lll")}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
          }}
        >
          <Button type="link" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <button
            style={{
              backgroundColor: checkEditor ? "green" : "#ddd9",
              color: "#fff",
              border: "none",
              padding: "3px 10px",
              cursor: checkEditor ? "pointer" : "not-allowed",
              pointerEvents: checkEditor ? null : "none",
              borderRadius: 15,
            }}
            disabled={checkEditor ? false : true}
            onClick={onPublish}
          >
            Publish
          </button>
        </div>
      </div>
      <div
        style={{
          width: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 30,
          position: "relative",
        }}
        onMouseDown={focus}
        className={classNames.editor}
      >
        {" "}
        <CustomSideToolbar
          sideBarActions={sideBarActions}
          open={openSideBar}
          setOpen={setOpenSideBar}
        />
        <Editor
          editorState={editorState}
          placeholder={placeholder}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          plugins={plugins}
          ref={(element) => {
            editor.current = element;
          }}
          blockStyleFn={myBlockStyleFn}
          spellCheck={true}
        />
        <AlignmentTool />
        <InlineToolbar>
          {(externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <Separator {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
              <HeadlineOneButton {...externalProps} />
              <HeadlineTwoButton {...externalProps} />
              <HeadlineThreeButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
            </div>
          )}
        </InlineToolbar>
      </div>
      <Upload
        action={"/files"}
        name="file"
        accept="image/*"
        showUploadList={false}
        onChange={({ file, fileList }) => {
          if (file.status !== "uploading") {
            handleImageUpload(file);
          }
        }}
      >
        <Button
          ref={inputRef}
          icon={<UploadOutlined />}
          style={{ display: "none" }}
        >
          Upload
        </Button>
      </Upload>
    </div>
  );
}

export default MediumEditor;
