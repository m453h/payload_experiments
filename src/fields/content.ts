import { deepmerge } from "@mui/utils";

import { ExternalEmbed } from "../blocks/roboshield/ExternalEmbed";
import { MediaBlock } from "../blocks/roboshield/MediaBlock";
import { RichText } from "../blocks/roboshield/RichText";

const content = (overrides) =>
  deepmerge(
    {
      name: "content",
      type: "blocks",
      blocks: [RichText, MediaBlock, ExternalEmbed],
    },
    overrides
  );

export default content;
