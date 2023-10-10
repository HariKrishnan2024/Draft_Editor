import { convertToHTML } from "draft-convert";

export const toHTML = (state) => {
  let html = convertToHTML({
    styleToHTML: (style) => {},
    entityToHTML: (entity, originalText) => {
      let type = entity.type;
      if (type === "LINK") {
        return <a href={entity.data.url}>{originalText}</a>;
      }
      if (type === "image" || type === "IMAGE") {
        return (
          <figure>
            <img
              src={entity.data.src}
              style={{
                width: "80%",
                height: "100%",
                objectFit: "cover",
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
              }}
            />
          </figure>
        );
      }
      if (type === "draft-js-iframely-plugin-embed") {
        return entity.data.html;
      }
      if (type === "divider") {
        return (
          <hr
            style={{
              width: "60%",
              border: "2px dashed gray",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        );
      }
      return originalText;
    },
    blockToHTML: (block) => {
      const type = block.type;
      if (type === "unstyled") {
        if (block.text === " " || block.text === "") return <br />;
        return <p />;
      }
      if (type === "atomic") {
        if (block.data && block.data.mathjax && block.data.html) {
          return `<div>${
            block.data.css ? `<style>${block.data.css}</style>` : ""
          }${block.data.html}</div>`;
        } else if (block.data && block.data.mathjax) {
          return `<div class="draft-latex-placeholder-block"> &lt;refresh to render LaTeX&gt; </div>`;
        } else {
          return { start: "<span>", end: "</span>" };
        }
      }
      if (type === "blockquote") {
        return (
          <blockquote
            style={{
              display: "block",
              color: "#999",
              fontFamily: "'Hoefler Text', Georgia, serif",
              fontStyle: "italic",
              fontSize: "18px",
              paddingLeft: "20px",
              borderLeft: "3px solid black",
              marginLeft: "20px",
            }}
          ></blockquote>
        );
      }
      if (type === "header-one") return <h1 />;
      if (type === "header-two") return <h2 />;
      if (type === "header-three") return <h3 />;
      if (type === "unordered-list-item")
        return {
          element: <li />,
          nest: <ul />,
        };
      if (type === "ordered-list-item")
        return {
          element: <li />,
          nest: <ol />,
        };
      return <span></span>;
    },
  })(state);
  return html;
};
