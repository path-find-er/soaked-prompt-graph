import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Octokit } from 'octokit';
import { useState } from 'react';

// set up a github octokit atom with the octokit instance
const githubOctokitAtom = atom<Octokit>(
  new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN })
);

// set up a atom to persist the api response in local storage based on a name assigned by the user
// const githubData = atomWithStorage<Record<string, unknown>>({data: ''}, "githubData");

const githubData = atomWithStorage('{}', 'githubData');

export default function MoonfishPage() {
  const [octokit] = useAtom(githubOctokitAtom);
  const [data, setData] = useAtom(githubData);

  // search github api for SAP/ui5-webcomponents's issues
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await octokit.graphql(
        `
        query {
          repository(owner: "SAP", name: "ui5-webcomponents") {
            issues(orderBy : {field: CREATED_AT, direction: DESC}, first: 10) {
              nodes {
                number
                body
              }
            }
          }
        }
      `
      );
      if (response?.repository?.issues?.nodes) {
        setData(response.repository.issues.nodes);
        setIssues(response.repository.issues.nodes);
      }
    } catch (error) {
      setError(error);
    }
    // check if the response is of the right type
    setLoading(false);
  };

  return (
    <div>
      <div>test</div>
    </div>
  );
}

const GitlabIssueSchema = {
  fields: [
    {
      name: 'activeLockReason',
      description: 'Reason that the conversation was locked.',
    },
    {
      name: 'assignees',
      description: 'A list of Users assigned to this object.',
    },
    {
      name: 'author',
      description: 'The actor who authored the comment.',
    },
    {
      name: 'authorAssociation',
      description: "Author's association with the subject of the comment.",
    },
    {
      name: 'body',
      description: 'Identifies the body of the issue.',
    },
    {
      name: 'bodyHTML',
      description: 'The body rendered to HTML.',
    },
    {
      name: 'bodyResourcePath',
      description: 'The http path for this issue body',
    },
    {
      name: 'bodyText',
      description: 'Identifies the body of the issue rendered to text.',
    },
    {
      name: 'bodyUrl',
      description: 'The http URL for this issue body',
    },
    {
      name: 'closed',
      description:
        '`true` if the object is closed (definition of closed may depend on type)',
    },
    {
      name: 'closedAt',
      description: 'Identifies the date and time when the object was closed.',
    },
    {
      name: 'comments',
      description: 'A list of comments associated with the Issue.',
    },
    {
      name: 'createdAt',
      description: 'Identifies the date and time when the object was created.',
    },
    {
      name: 'createdViaEmail',
      description: 'Check if this comment was created via an email reply.',
    },
    {
      name: 'databaseId',
      description: 'Identifies the primary key from the database.',
    },
    {
      name: 'editor',
      description: 'The actor who edited the comment.',
    },
    {
      name: 'hovercard',
      description: 'The hovercard information for this issue',
    },
    {
      name: 'id',
      description: null,
    },
    {
      name: 'includesCreatedEdit',
      description:
        'Check if this comment was edited and includes an edit with the creation data',
    },
    {
      name: 'isPinned',
      description:
        'Indicates whether or not this issue is currently pinned to the repository issues list',
    },
    {
      name: 'isReadByViewer',
      description: 'Is this issue read by the viewer',
    },
    {
      name: 'labels',
      description: 'A list of labels associated with the object.',
    },
    {
      name: 'lastEditedAt',
      description: 'The moment the editor made the last edit',
    },
    {
      name: 'linkedBranches',
      description: 'Branches linked to this issue.',
    },
    {
      name: 'locked',
      description: '`true` if the object is locked',
    },
    {
      name: 'milestone',
      description: 'Identifies the milestone associated with the issue.',
    },
    {
      name: 'number',
      description: 'Identifies the issue number.',
    },
    {
      name: 'participants',
      description:
        'A list of Users that are participating in the Issue conversation.',
    },
    {
      name: 'projectCards',
      description: 'List of project cards associated with this issue.',
    },
    {
      name: 'projectItems',
      description: 'List of project items associated with this issue.',
    },
    {
      name: 'projectNextItems',
      description: 'List of project (beta) items associated with this issue.',
    },
    {
      name: 'projectV2',
      description: 'Find a project by number.',
    },
    {
      name: 'projectsV2',
      description: 'A list of projects under the owner.',
    },
    {
      name: 'publishedAt',
      description: 'Identifies when the comment was published at.',
    },
    {
      name: 'reactionGroups',
      description:
        'A list of reactions grouped by content left on the subject.',
    },
    {
      name: 'reactions',
      description: 'A list of Reactions left on the Issue.',
    },
    {
      name: 'repository',
      description: 'The repository associated with this node.',
    },
    {
      name: 'resourcePath',
      description: 'The HTTP path for this issue',
    },
    {
      name: 'state',
      description: 'Identifies the state of the issue.',
    },
    {
      name: 'stateReason',
      description: 'Identifies the reason for the issue state.',
    },
    {
      name: 'timelineItems',
      description:
        'A list of events, comments, commits, etc. associated with the issue.',
    },
    {
      name: 'title',
      description: 'Identifies the issue title.',
    },
    {
      name: 'titleHTML',
      description: 'Identifies the issue title rendered to HTML.',
    },
    {
      name: 'trackedInIssues',
      description: 'A list of issues that track this issue',
    },
    {
      name: 'trackedIssues',
      description: 'A list of issues tracked inside the current issue',
    },
    {
      name: 'trackedIssuesCount',
      description: 'The number of tracked issues for this issue',
    },
    {
      name: 'updatedAt',
      description:
        'Identifies the date and time when the object was last updated.',
    },
    {
      name: 'url',
      description: 'The HTTP URL for this issue',
    },
    {
      name: 'userContentEdits',
      description: 'A list of edits to this content.',
    },
    {
      name: 'viewerCanReact',
      description: 'Can user react to this subject',
    },
    {
      name: 'viewerCanSubscribe',
      description:
        'Check if the viewer is able to change their subscription status for the repository.',
    },
    {
      name: 'viewerCanUpdate',
      description: 'Check if the current viewer can update this object.',
    },
    {
      name: 'viewerCannotUpdateReasons',
      description:
        'Reasons why the current viewer can not update this comment.',
    },
    {
      name: 'viewerDidAuthor',
      description: 'Did the viewer author this comment.',
    },
    {
      name: 'viewerSubscription',
      description:
        'Identifies if the viewer is watching, not watching, or ignoring the subscribable entity.',
    },
  ],
};

/*
https://docs.github.com/en/graphql/overview/explorer

| name                      | description                                                                              |
|---------------------------|------------------------------------------------------------------------------------------|
| activeLockReason          | Reason that the conversation was locked.                                                 |
| assignees                 | A list of Users assigned to this object.                                                 |
| author                    | The actor who authored the comment.                                                      |
| authorAssociation         | Author's association with the subject of the comment.                                    |
| body                      | Identifies the body of the issue.                                                        |
| bodyHTML                  | The body rendered to HTML.                                                               |
| bodyResourcePath          | The http path for this issue body                                                        |
| bodyText                  | Identifies the body of the issue rendered to text.                                       |
| bodyUrl                   | The http URL for this issue body                                                         |
| closed                    | `true` if the object is closed (definition of closed may depend on type)                 |
| closedAt                  | Identifies the date and time when the object was closed.                                 |
| comments                  | A list of comments associated with the Issue.                                            |
| createdAt                 | Identifies the date and time when the object was created.                                |
| createdViaEmail           | Check if this comment was created via an email reply.                                    |
| databaseId                | Identifies the primary key from the database.                                            |
| editor                    | The actor who edited the comment.                                                        |
| hovercard                 | The hovercard information for this issue                                                 |
| id                        | null                                                                                     |
| includesCreatedEdit       | Check if this comment was edited and includes an edit with the creation data             |
| isPinned                  | Indicates whether or not this issue is currently pinned to the repository issues list    |
| isReadByViewer            | Is this issue read by the viewer                                                         |
| labels                    | A list of labels associated with the object.                                             |
| lastEditedAt              | The moment the editor made the last edit                                                 |
| linkedBranches            | Branches linked to this issue.                                                           |
| locked                    | `true` if the object is locked                                                           |
| milestone                 | Identifies the milestone associated with the issue.                                      |
| number                    | Identifies the issue number.                                                             |
| participants              | A list of Users that are participating in the Issue conversation.                        |
| projectCards              | List of project cards associated with this issue.                                        |
| projectItems              | List of project items associated with this issue.                                        |
| projectNextItems          | List of project (beta) items associated with this issue.                                 |
| projectV2                 | Find a project by number.                                                                |
| projectsV2                | A list of projects under the owner.                                                      |
| publishedAt               | Identifies when the comment was published at.                                            |
| reactionGroups            | A list of reactions grouped by content left on the subject.                              |
| reactions                 | A list of Reactions left on the Issue.                                                   |
| repository                | The repository associated with this node.                                                |
| resourcePath              | The HTTP path for this issue                                                             |
| state                     | Identifies the state of the issue.                                                       |
| stateReason               | Identifies the reason for the issue state.                                               |
| timelineItems             | A list of events, comments, commits, etc. associated with the issue.                     |
| title                     | Identifies the issue title.                                                              |
| titleHTML                 | Identifies the issue title rendered to HTML.                                             |
| trackedInIssues           | A list of issues that track this issue                                                   |
| trackedIssues             | A list of issues tracked inside the current issue                                        |
| trackedIssuesCount        | The number of tracked issues for this issue                                              |
| updatedAt                 | Identifies the date and time when the object was last updated.                           |
| url                       | The HTTP URL for this issue                                                              |
| userContentEdits          | A list of edits to this content.                                                         |
| viewerCanReact            | Can user react to this subject                                                           |
| viewerCanSubscribe        | Check if the viewer is able to change their subscription status for the repository.      |
| viewerCanUpdate           | Check if the current viewer can update this object.                                      |
| viewerCannotUpdateReasons | Reasons why the current viewer can not update this comment.                              |
| viewerDidAuthor           | Did the viewer author this comment.                                                      |
| viewerSubscription        | Identifies if the viewer is watching, not watching, or ignoring the subscribable entity. |


| name                      | description                                                                              |
|---------------------------|------------------------------------------------------------------------------------------|
| activeLockReason          | Reason that the conversation was locked.                                                 |
| assignees                 | A list of Users assigned to this object.                                                 |
| author                    | The actor who authored the comment.                                                      |
| body                      | Identifies the body of the issue.                                                        |
| bodyText                  | Identifies the body of the issue rendered to text.                                       |
| closedAt                  | Identifies the date and time when the object was closed.                                 |
| comments                  | A list of comments associated with the Issue.                                            |
| createdAt                 | Identifies the date and time when the object was created.                                |
| includesCreatedEdit       | Check if this comment was edited and includes an edit with the creation data             |
| isPinned                  | Indicates whether or not this issue is currently pinned to the repository issues list    |
| labels                    | A list of labels associated with the object.                                             |
| linkedBranches            | Branches linked to this issue.                                                           |
| locked                    | `true` if the object is locked                                                           |
| milestone                 | Identifies the milestone associated with the issue.                                      |
| number                    | Identifies the issue number.                                                             |
| participants              | A list of Users that are participating in the Issue conversation.                        |
| reactions                 | A list of Reactions left on the Issue.                                                   |
| repository                | The repository associated with this node.                                                |
| state                     | Identifies the state of the issue.                                                       |
| stateReason               | Identifies the reason for the issue state.                                               |
| timelineItems             | A list of events, comments, commits, etc. associated with the issue.                     |
| title                     | Identifies the issue title.                                                              |
| trackedInIssues           | A list of issues that track this issue                                                   |
| trackedIssues             | A list of issues tracked inside the current issue                                        |
| trackedIssuesCount        | The number of tracked issues for this issue                                              |
| url                       | The HTTP URL for this issue                                                              |


activeLockReason, assignees, author, body, bodyText, closedAt, comments, createdAt, includesCreatedEdit, isPinned, labels, linkedBranches, locked, milestone, number, participants, reactions, repository, state, stateReason, timelineItems, title, trackedInIssues, trackedIssues, trackedIssuesCount, url
*/

// Questions to answer:
// 1. Which components have a lot of issues related to them?
