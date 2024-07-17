import { faker } from "https://esm.sh/@faker-js/faker@v8.4.0";

// Generate Data
function generateRandomNum() {
  return Math.floor(Math.random() * 30 + 1);
}

const personalProfile = {
  profileImage: "https://i.postimg.cc/m2YXBvmj/unnamed.png",
  directMessages: 8,
};

function generateStoryImages() {
  for (let i = 0; i < generateRandomNum(); i++) {
    return {
      storyImage: faker.image.urlPicsumPhotos({ width: 1080, height: 1920 }),
    };
  }
}

function generateData() {
  return {
    user: {
      profileImage: faker.image.avatar(),
      userName: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
    },

    post: {
      image: faker.image.urlPicsumPhotos(),
      postMsg: faker.lorem.sentence(),
    },

    metaData: {
      postLikeCount: faker.number.int({ max: 10000 }),
      postTime: faker.number.int({ max: 59 }),
    },

    comment: {
      comment: faker.lorem.sentence(),
      commentLikeCount: faker.number.int({ max: 100 }),
      commentTime: faker.number.int({ max: 24 }),
      id: faker.string.uuid(),
    },

    comments: [],
    stories: [],
  };
}

// Create an Array of posts
function generateMultiData() {
  const multiData = [];
  for (let i = 0; i < generateRandomNum(); i++) {
    const data = generateData();

    // Add comments
    for (let p = 0; p < generateRandomNum(); p++) {
      data.comments.push(generateData());
    }

    // Add stories
    for (let s = 0; s < generateRandomNum(); s++) {
      data.stories.push(generateStoryImages());
    }

    // Add replies and stories to comments
    data.comments.forEach((comment) => {
      for (let r = 0; r < generateRandomNum(); r++) {
        comment.comments.push(generateData());
        comment.stories.push(generateStoryImages());
      }

      // Add storeis to replies
      comment.comments.forEach((replies) => {
        for (let r = 0; r < generateRandomNum(); r++) {
          replies.stories.push(generateStoryImages());
        }
      });
    });

    // Add stories to replies

    multiData.push(data);
  }
  return multiData;
}

const allProfiles = generateMultiData();
const allPosts = generateMultiData();

console.log(allProfiles, allPosts);
// Data Generated Above

// ---------------------------------------------- APP BUILD STARTS FROM BELOW ----------------------------------------------------------------------------

// Selectors
const body = $("body");
const profileList = $(".profileList");
const postList = $(".postList");
const dmBox = $(".dmBox");
const loadMore = $(".loadMore");
const navBar = $(".navBar");
const sData = $(".profileData");
const loader = $(".loader");
const root = document.documentElement;

// Helper Functions
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function _(type) {
  return document.createElement(type);
}

// Get navBar and  storydata height
const topContentHeight = navBar.clientHeight + sData.clientHeight;
// Add it to CSS
root.style.setProperty("--topContentHeight", `${topContentHeight}px`);

// Event Listeners
loadMore.addEventListener("click", renderMorePosts);
window.addEventListener("load", onLoadActions);

// Resuable Functions
function profile(srcLink, userName, appendContainer) {
  const itemBox = _("li");
  itemBox.classList.add("itemBox");
  const profileItem = _("div");
  profileItem.classList.add("profileItem");
  const profileLink = _("a");
  profileLink.classList.add("profileLink");
  profileLink.href = "#";
  const profileImgBox = _("div");
  profileImgBox.classList.add("profileImgBox");
  const profileImg = _("img");
  profileImg.classList.add("profileImg");
  profileImg.src = srcLink;
  const profileUser = _("p");
  profileUser.classList.add("profileUser");
  profileUser.innerText = userName;
  const storyBox = _("ul");
  storyBox.classList.add("storyBox");

  //   Append
  profileLink.append(profileImgBox);
  profileImgBox.append(profileImg);
  profileItem.append(profileLink);
  profileItem.append(profileUser);
  profileItem.append(storyBox);
  itemBox.append(profileItem);
  appendContainer.append(itemBox);

  visitedProfile(".profileLink");
}

function onLoadActions() {
  body.classList.add("loaded");
  const removeLoader = setTimeout(() => {
    loader.remove();
  }, 1000);
}

// Create Personal Profile
function defaultProfile() {
  profile(personalProfile.profileImage, "Your story", profileList);
  const profileSvgBox = _("div");
  profileSvgBox.classList.add("profileSvgBox");
  profileSvgBox.innerText = "+";
  const profileImgBox = $(".profileImgBox");
  profileImgBox.append(profileSvgBox);

  // update no of dms
  dmBox.innerText = generateRandomNum();
}

defaultProfile();

// Run Array Loop to access data
allProfiles.forEach((data) => {
  // Generate Stories
  renderProfiles(data);
});

allPosts.forEach((data) => {
  // Generate Posts
  renderPosts(data);
});

// Functions

// Create Profiles
function renderProfiles(data) {
  profile(data.user.profileImage, data.user.userName, profileList);
  renderStory(data, ".profileList .storyBox");
}

// Create Posts
function renderPosts(data) {
  profile(data.user.profileImage, data.user.userName, postList);
  renderStory(data, ".postList .profileItem .storyBox");
  // Check verification
  if (data.user.isVerified) {
    checkVerification(".postList .profileItem");
  }

  //   Create post Item
  const postItem = _("div");
  postItem.classList.add("postItem");
  const itemBoxs = $$(".postList .itemBox");
  itemBoxs.forEach((itemBox) => {
    itemBox.append(postItem);
  });

  //   Create post Box
  const postBox = _("div");
  postBox.classList.add("postBox");
  postItem.append(postBox);

  //   Create post
  const post = _("img");
  post.classList.add("post");
  post.src = data.post.image;
  postBox.append(post);

  //   Create actionBox
  const actionBox = _("div");
  actionBox.classList.add("postActionBox");
  const actionLeft = _("div");
  actionLeft.classList.add("postActionLeft");
  const like = _("a");
  like.href = "#";
  like.classList.add("likeHeart");
  like.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="#fff"
  class="w-6 h-6"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
  />
</svg>`;
  const comment = _("a");
  comment.href = "#";
  comment.innerHTML = `<?xml version="1.0" ?><svg enable-background="new 0 0 32 32" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="_x33_0"/><g id="_x32_9"/><g id="_x32_8"/><g id="_x32_7"/><g id="_x32_6"/><g id="_x32_5"/><g id="_x32_4"/><g id="_x32_3"/><g id="_x32_2"/><g id="_x32_1"/><g id="_x32_0"/><g id="_x31_8"><path d="M25.784,21.017C26.581,19.467,27,17.741,27,16c0-6.065-4.935-11-11-11S5,9.935,5,16s4.935,11,11,11   c1.742,0,3.468-0.419,5.018-1.215l4.74,1.185C25.838,26.99,25.919,27,26,27c0.262,0,0.518-0.103,0.707-0.293   c0.248-0.249,0.349-0.609,0.263-0.95L25.784,21.017z M23.751,21.127l0.874,3.498l-3.498-0.875   c-0.247-0.061-0.509-0.026-0.731,0.098C19.055,24.602,17.534,25,16,25c-4.963,0-9-4.038-9-9s4.037-9,9-9s9,4.038,9,9   c0,1.534-0.398,3.054-1.151,4.395C23.724,20.618,23.688,20.88,23.751,21.127z" fill=""/></g><g id="_x31_7"/><g id="_x31_6"/><g id="_x31_5"/><g id="_x31_4"/><g id="_x31_3"/><g id="_x31_2"/><g id="_x31_1"/><g id="_x31_0"/><g id="_x39_"/><g id="_x38_"/><g id="_x37_"/><g id="_x36_"/><g id="_x35_"/><g id="_x34_"/><g id="_x33_"/><g id="_x32_"/><g id="_x31_"/><g id="Guides"/></svg>`;
  const share = _("a");
  share.href = "#";
  share.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
  <svg version="1.1" viewBox="0 0 256 256" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    
    <g transform="translate(1.4066 1.4066) scale(2.81)" stroke-linecap="round">
        <path d="m31.121 43.543c-0.852 0-1.689-0.362-2.275-1.042l-28.119-32.665c-0.778-0.902-0.947-2.18-0.432-3.255 0.516-1.074 1.607-1.748 2.81-1.7l84 2.952c1.356 0.047 2.513 1 2.817 2.324 0.306 1.323-0.315 2.686-1.515 3.323l-55.88 29.712c-0.444 0.237-0.927 0.351-1.406 0.351zm-21.374-32.425 22.082 25.65 43.881-23.332-65.963-2.318z"/>
        <path d="m42.475 85.121c-0.145 0-0.291-0.011-0.437-0.032-1.179-0.173-2.144-1.027-2.458-2.178l-11.354-41.578c-0.37-1.353 0.248-2.781 1.486-3.439l55.88-29.712c1.196-0.637 2.676-0.39 3.602 0.603 0.927 0.993 1.07 2.484 0.352 3.636l-44.527 71.289c-0.553 0.886-1.519 1.411-2.544 1.411zm-7.829-43.055 8.917 32.651 34.965-55.983-43.882 23.332z"/>
    </g>
    </svg>
  `;
  actionLeft.append(like);
  actionLeft.append(comment);
  actionLeft.append(share);
  const actionRight = _("div");
  actionRight.classList.add("postActionRight");
  const bookMark = _("a");
  bookMark.href = "#";
  bookMark.classList.add("bookmark");
  bookMark.innerHTML = `<?xml version="1.0" ?><svg enable-background="new 0 0 32 32" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="_x33_0"/><g id="_x32_9"/><g id="_x32_8"/><g id="_x32_7"/><g id="_x32_6"/><g id="_x32_5"/><g id="_x32_4"/><g id="_x32_3"/><g id="_x32_2"/><g id="_x32_1"/><g id="_x32_0"/><g id="_x31_8"/><g id="_x31_7"/><g id="_x31_6"/><g id="_x31_5"/><g id="_x31_4"/><g id="_x31_3"/><g id="_x31_2"/><g id="_x31_1"/><g id="_x31_0"/><g id="_x39_"/><g id="_x38_"/><g id="_x37_"/><g id="_x36_"/><g id="_x35_"/><g id="_x34_"/><g id="_x33_"/><g id="_x32_"><path d="M23,5H9C7.346,5,6,6.346,6,8v19c0,0.382,0.218,0.73,0.561,0.898c0.344,0.167,0.752,0.126,1.053-0.109L16,21.267   l8.386,6.522C24.565,27.929,24.782,28,25,28c0.149,0,0.3-0.034,0.439-0.102C25.782,27.73,26,27.382,26,27V8C26,6.346,24.654,5,23,5   z M24,24.956l-7.386-5.745C16.434,19.07,16.217,19,16,19s-0.434,0.07-0.614,0.21L8,24.956V8c0-0.551,0.449-1,1-1h14   c0.551,0,1,0.449,1,1V24.956z"/></g><g id="_x31_"/><g id="Guides"/></svg>`;
  actionRight.append(bookMark);
  actionBox.append(actionLeft);
  actionBox.append(actionRight);
  postItem.append(actionBox);

  //   Create MetaBox
  const metaBox = _("div");
  metaBox.classList.add("metaBox");
  postItem.append(metaBox);
  const likes = _("a");
  likes.href = "#";
  const formattedLikeCount =
    data.metaData.postLikeCount.toLocaleString("en-US");
  likes.innerText = `${formattedLikeCount} likes`;
  metaBox.append(likes);
  const postMessage = _("p");
  postMessage.innerHTML = `<span>${data.user.userName}</span>  ${data.post.postMsg}`;
  metaBox.append(postMessage);
  const comments = _("a");
  comments.href = "#";
  comments.classList.add("viewComments");
  const allComments = data.comments;
  comments.innerText = `View all ${allComments.length} comments`;
  metaBox.append(comments);
  const time = _("p");
  time.innerText = `${data.metaData.postTime} minutes ago`;
  metaBox.append(time);

  // Add like functionality
  const hearts = $$(".likeHeart");
  hearts.forEach((heart) => {
    heart.addEventListener("click", (e) => {
      heart.classList.toggle("liked");
      e.stopImmediatePropagation();
      if (heart.classList.contains("liked")) {
        likes.innerText = `liked by You and ${formattedLikeCount} people`;
      } else {
        likes.innerText = `${formattedLikeCount} likes`;
      }
    });
  });

  //  Create Comment Box
  //   Create Title
  const commentBox = _("div");
  commentBox.classList.add("commentData");
  postItem.append(commentBox);
  const titleBox = _("div");
  titleBox.classList.add("titleBox");
  commentBox.append(titleBox);
  const title = _("p");
  title.innerText = "Comments";
  titleBox.append(title);
  const svgBox = _("div");
  svgBox.classList.add("svgBox");
  titleBox.append(svgBox);
  const svgLink = _("a");
  svgLink.classList.add("commentBoxClose");
  svgBox.append(svgLink);
  const svg = _("svg");
  svg.innerHTML = ` <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth="{1.5}"
  stroke="currentColor"
  className="w-6 h-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M6 18 18 6M6 6l12 12"
  />
</svg>`;
  svgLink.append(svg);

  //   Create Comment List
  const commentList = _("ul");
  commentList.classList.add("commentList");
  commentBox.append(commentList);

  //Attempt at conditional rendering for comments
  const viewBtns = $$(".viewComments");
  viewBtns.forEach((viewBtn) => {
    viewBtn.addEventListener("click", function () {
      allComments.forEach((allComment) => {
        // Add comment
        const postComment = allComment.comment.comment;
        const commentItem = _("li");
        commentItem.classList.add("commentItem");
        const commentSpan = _("span");
        commentSpan.classList.add("comment");
        commentSpan.innerText = postComment;
        commentItem.append(commentSpan);

        const viewReplyBtn = _("button");
        const replies = allComment.comments;
        viewReplyBtn.classList.add("viewReplyBtn");
        viewReplyBtn.innerText = `View ${replies.length} more replies`;
        commentItem.append(viewReplyBtn);
        commentList.append(commentItem);

        // Add Comment Info
        const commentInfo = _("div");
        commentInfo.classList.add("commentInfo");
        commentItem.prepend(commentInfo);
        // Add comment Left Info
        const commentInfoLeft = _("div");
        commentInfoLeft.classList.add("commentInfoLeft");
        commentInfo.append(commentInfoLeft);
        // Add Profile
        const commentProfile = _("ul");
        commentProfile.classList.add("commentProfile");
        const userProfile = profile(
          allComment.user.profileImage,
          allComment.user.userName,
          commentProfile
        );
        commentInfoLeft.append(commentProfile);
        // Check verification
        if (allComment.user.isVerified) {
          checkVerification(".commentProfile .profileItem");
        }

        // Add visisted profile
        visitedProfile(".postList .commentList .profileLink");

        // Add story data
        const commentStory = renderStory(
          allComment,
          ".postList .commentList .storyBox"
        );

        // Add comment time
        const commentTime = _("span");
        commentTime.classList.add("commentTimeStamp");
        if (allComment.comment.commentTime === 0) {
          commentTime.innerText = `now`;
        } else {
          commentTime.innerText = `${allComment.comment.commentTime}h`;
        }
        commentInfoLeft.append(commentTime);

        // Add comment Right Info
        const commentInfoRight = _("div");
        commentInfoRight.classList.add("commentInfoRight");
        commentInfo.append(commentInfoRight);
        // Create comment like
        const svgBox = _("div");
        svgBox.classList.add("svgBox");
        commentInfoRight.append(svgBox);
        const svgLink = _("a");
        svgLink.classList.add("commentLike");
        svgBox.append(svgLink);
        const svg = _("svg");
        svg.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#fff"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>`;
        svgLink.append(svg);
        const commentInnerLikeCount = _("span");
        commentInnerLikeCount.classList.add("commentLikeCount");
        if (allComment.comment.commentLikeCount === 0) {
          commentInnerLikeCount.innerText = "";
        } else {
          commentInnerLikeCount.innerText = `${allComment.comment.commentLikeCount}`;
        }

        svgLink.append(commentInnerLikeCount);

        // Add Comment like  functionality
        const commenthearts = $$(".commentLike");
        commenthearts.forEach((commentheart) => {
          commentheart.addEventListener("click", (e) => {
            commentheart.classList.toggle("liked");
            e.stopImmediatePropagation();
            if (commentheart.classList.contains("liked")) {
              commentInnerLikeCount.innerText = `${
                allComment.comment.commentLikeCount + 1
              }`;
            } else {
              commentInnerLikeCount.innerText = `${allComment.comment.commentLikeCount}`;
            }
          });
        });

        const replyList = _("ul");
        replyList.classList.add("replyList");
        commentItem.append(replyList);

        // Attempt at conditional rendering for replies
        const replyBtns = $$(".viewReplyBtn");
        replyBtns.forEach((replyBtn, rbIndex) => {
          replyBtn.addEventListener("click", function (e) {
            e.stopImmediatePropagation();
            replyBtn.classList.toggle("active");
            replies.forEach((reply) => {
              const replyText = reply.comment.comment;
              const replyItem = _("li");
              replyItem.classList.add("replyItem");
              const commentSpan = _("span");
              commentSpan.classList.add("comment");
              commentSpan.innerText = replyText;
              replyItem.append(commentSpan);
              const replyLists = $$(".replyList");
              replyLists.forEach((replyList, rlIndex) => {
                if (
                  rbIndex === rlIndex &&
                  replyBtn.classList.contains("active")
                ) {
                  replyList.append(replyItem);
                } else {
                  replyList.innerHTML = "";
                }

                if (replyBtn.classList.contains("active")) {
                  replyBtn.innerText = `Hide replies`;
                } else {
                  replyBtn.innerText = `View ${replies.length} more replies`;
                }
              });

              // Add Comment Info
              const commentInfo = _("div");
              commentInfo.classList.add("commentInfo");
              replyItem.prepend(commentInfo);
              // Add comment Left Info
              const commentInfoLeft = _("div");
              commentInfoLeft.classList.add("commentInfoLeft");
              commentInfo.append(commentInfoLeft);
              // Add Profile
              const commentProfile = _("ul");
              commentProfile.classList.add("commentProfile");
              const userProfile = profile(
                reply.user.profileImage,
                reply.user.userName,
                commentProfile
              );
              commentInfoLeft.append(commentProfile);
              // Check verification
              if (reply.user.isVerified) {
                checkVerification(".commentProfile .profileItem");
              }
              // Add visisted profile
              visitedProfile(".postList .commentList .replyList .profileLink");
              // Add story data
              const commentStory = renderStory(
                reply,
                ".postList .commentList .replyList .storyBox"
              );
              // Add comment time
              const commentTime = _("span");
              commentTime.classList.add("commentTimeStamp");
              if (reply.comment.commentTime === 0) {
                commentTime.innerText = `now`;
              } else {
                commentTime.innerText = `${reply.comment.commentTime}h`;
              }
              commentInfoLeft.append(commentTime);
              // Add comment Right Info
              const commentInfoRight = _("div");
              commentInfoRight.classList.add("commentInfoRight");
              commentInfo.append(commentInfoRight);
              // Create comment like
              const svgBox = _("div");
              svgBox.classList.add("svgBox");
              commentInfoRight.append(svgBox);
              const svgLink = _("a");
              svgLink.classList.add("commentLike");
              svgBox.append(svgLink);
              const svg = _("svg");
              svg.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#fff"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>`;
              svgLink.append(svg);
              const commentInnerLikeCount = _("span");
              commentInnerLikeCount.classList.add("commentLikeCount");
              if (reply.comment.commentLikeCount === 0) {
                commentInnerLikeCount.innerText = "";
              } else {
                commentInnerLikeCount.innerText = `${reply.comment.commentLikeCount}`;
              }
              svgLink.append(commentInnerLikeCount);
              // Add Comment like  functionality
              const commenthearts = $$(".commentLike");
              commenthearts.forEach((commentheart) => {
                commentheart.addEventListener("click", (e) => {
                  commentheart.classList.toggle("liked");
                  e.stopImmediatePropagation();
                  if (commentheart.classList.contains("liked")) {
                    commentInnerLikeCount.innerText = `${
                      reply.comment.commentLikeCount + 1
                    }`;
                  } else {
                    commentInnerLikeCount.innerText = `${reply.comment.commentLikeCount}`;
                  }
                });
              });
            });
          });
        });
      });
    });
  });

  showCommentBox();
  closeCommentBox();
}

// Create More Posts
function renderMorePosts() {
  const morePosts = generateMultiData();
  morePosts.forEach((data) => {
    renderPosts(data);
  });

  showCommentBox();
  closeCommentBox();
}

// Add Verification
function checkVerification(selector) {
  const profileVerified = _("span");
  profileVerified.classList.add("profileVerify");
  profileVerified.innerHTML = `<svg  viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect  stroke='none' fill='#000000' opacity='0'/>
    <g transform="matrix(0.42 0 0 0.42 12 12)" >
    <g style="" >
    <g transform="matrix(1 0 0 1 0 0)" >
    <polygon style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(66,165,245); fill-rule: nonzero; opacity: 1;" points="5.62,-21 9.05,-15.69 15.37,-15.38 15.69,-9.06 21,-5.63 18.12,0 21,5.62 15.69,9.05 15.38,15.37 9.06,15.69 5.63,21 0,18.12 -5.62,21 -9.05,15.69 -15.37,15.38 -15.69,9.06 -21,5.63 -18.12,0 -21,-5.62 -15.69,-9.05 -15.38,-15.37 -9.06,-15.69 -5.63,-21 0,-18.12 " />
    </g>
    <g transform="matrix(1 0 0 1 -0.01 0.51)" >
    <polygon style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" points="-2.6,6.74 -9.09,0.25 -6.97,-1.87 -2.56,2.53 7,-6.74 9.09,-4.59 " />
    </g>
    </g>
    </g>
    </svg>`;

  const profileItems = $$(selector);
  profileItems.forEach((profileItem) => {
    profileItem.append(profileVerified);
  });
}

// Create Story
function renderStory(data, appendContainer) {
  const stories = data.stories;

  const profileItems = $$(".profileLink");
  const storyBoxes = $$(appendContainer);

  profileItems.forEach((profileItem) => {
    profileItem.addEventListener("click", function (e) {
      e.stopImmediatePropagation();

      stories.forEach((story) => {
        const storyItem = _("li");
        storyItem.classList.add("storyItem");
        const storyImg = _("img");
        storyImg.classList.add("story");
        storyImg.src = story.storyImage;
        storyItem.append(storyImg);
        storyBoxes.forEach((storyBox) => {
          storyBox.append(storyItem);
        });
      });

      const storyItems = $$(".storyItem");
      storyItems.forEach((storyItem) => {
        storyItem.classList.remove("active");
        storyItem.addEventListener("click", () => {
          storyItem.classList.add("active");
          storyItem.addEventListener("animationend", () => {
            storyItem.remove();
          });
        });
      });
    });
  });
}

// Show CommentBox
function showCommentBox() {
  const viewCommentBtns = $$(".viewComments");
  viewCommentBtns.forEach((viewCommentBtn, btnIndex) => {
    viewCommentBtn.addEventListener("click", function () {
      body.classList.add("active");
      const commentDatas = $$(".commentData");
      commentDatas.forEach((commentData, cBoxIndex) => {
        if (btnIndex === cBoxIndex) {
          commentData.classList.add("active");
        }
      });
    });
  });
}

// Close CommentBox
function closeCommentBox() {
  const svgLinks = $$(".commentBoxClose");
  svgLinks.forEach((svgLink) => {
    svgLink.addEventListener("click", function () {
      body.classList.remove("active");

      const commentLists = $$(".commentList");
      commentLists.forEach((commentList) => {
        commentList.innerHTML = "";
      });

      const commentDatas = $$(".commentData");
      commentDatas.forEach((commentData) => {
        commentData.classList.remove("active");
      });
    });
  });
}

// Add visisted class to profiles
function visitedProfile(selector) {
  // Select all items
  const profileLinks = $$(selector);

  // add visited class
  profileLinks.forEach((profileLink) => {
    profileLink.addEventListener("click", (e) => {
      profileLink.classList.add("visited");
    });
  });
}
