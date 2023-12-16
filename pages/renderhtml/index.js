import { useSelector } from "react-redux";

function RenderHtml() {
  const htmlData = useSelector((state) => state.editor.blogHtmlData);
  console.log(htmlData);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlData,
      }}
      style={{
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  );
}

export default RenderHtml;
