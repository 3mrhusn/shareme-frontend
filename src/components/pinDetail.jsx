import React, { useContext, useEffect, useState } from 'react';

import Spinner from '../components/spinner';
import { UserContext } from '../context/userContext';
import { useParams } from 'react-router-dom';
import {
  fetchPinDetails,
  fetchPinsWithSameCategory,
  postPinComment,
} from '../Utils/APIs/pinsAPI';
import { urlFor } from '../Utils/APIs/client';
import PinDownloadIcon from './pinDownloadIcon';
import UserCard from './userCard';
import MoreRelatedPins from './moreRelatedPins';

const PinDetail = () => {
  const { user } = useContext(UserContext);
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const addNewComment = () => {
    setAddingComment(true);
    postPinComment(pinId, comment, user).then(() => {
      fetchPinDetails(pinId).then((data) => {
        setPinDetail(data[0]);
        setAddingComment(false);
        setComment('');
      });
    });
  };
  useEffect(() => {
    fetchPinDetails(pinId).then((data) => {
      setPinDetail(data[0]);
      if (data[0])
        fetchPinsWithSameCategory(data[0]).then((res) => setPins(res));
    });
  }, [pinId]);
  return (
    <Spinner isLoading={!pinDetail} message="Loading Pin..">
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: '1300px', borderRadius: '32px' }}
      >
        <div className="flex justify-center items-center md:items-start">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
            style={{ maxHeight: '70vh' }}
          />
        </div>
        <div className="flex flex-1 flex-col lg:pl-6">
          <div className="flex items-center justify-between p-5 flex-1 w-full xl:min-w-620">
            <PinDownloadIcon url={pinDetail?.image?.asset?.url} />
            <a
              className=" whitespace-nowrap   overflow-hidden text-gray-700   text-sm md:text-base"
              style={{ maxWidth: '40vw' }}
              href={pinDetail?.destination}
              target="_blank"
              rel="noreferrer"
              title={pinDetail?.destination}
            >
              {pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-1">
              {pinDetail?.title}
            </h1>
            <p className="mt-2 text-base font-thin">{pinDetail?.about}</p>
          </div>
          <div className="mt-5 w-fit">
            <UserCard showImg showName redirect user={pinDetail?.postedBy} />
          </div>
          <h2 className="mt-5  text-lg font-semibold">Comments</h2>
          <div className="max-h-370  overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment?.postedBy?.image}
                  alt={'user-profile'}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col ">
                  <p className="font-bold">{comment?.postedBy.userName}</p>
                  <p className=" break-words  font-semibold text-gray-600 text-sm ">
                    {comment?.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-start my-6 gap-3">
            <UserCard
              showImg
              redirect
              user={user}
              imageWidth={9}
              imageHeight={9}
            />
            <textarea
              className="flex-1 resize-none overflow-hidden break-words border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && !e.shiftKey) {
                  e.preventDefault();
                  addNewComment();
                }
              }}
            />
            <button
              className="bg-red-500 text-white self-center rounded-full px-6 mx-5 py-2 font-semibold text-base"
              type="button"
              onClick={() => {
                comment && addNewComment();
              }}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      <MoreRelatedPins relatedPins={pins} />
    </Spinner>
  );
};

export default PinDetail;
