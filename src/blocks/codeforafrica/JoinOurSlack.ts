import linkGroup from "../../fields/links/linkGroup";

const JoinOurSlack = {
  slug: "join-our-slack",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "subtitle",
      type: "text",
      required: true,
    },
    linkGroup({ overrides: { name: "action", label: "Action" } }),
  ],
};

export default JoinOurSlack;
