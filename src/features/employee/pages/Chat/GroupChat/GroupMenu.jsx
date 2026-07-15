/** @format */

import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentId, setDocumentID } from "@/store/chatSlice";
import { defaultUserImg } from "@/assets/index";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";

const GroupMenu = ({ collections, colors }) => {
  const documentId = useSelector(fetchDocumentId);

  const dispatch = useDispatch();

  const documentIdSetter = (id) => {
    dispatch(setDocumentID(id));
  };

  return (
    <>
      <nav className="menu-list">
        {collections?.map((nav, index) => {
          const colorItem = colors[index % colors.length];
          return (
            <span
              key={`chats${nav.id}${index}`}
              className={`container ${
                documentId === nav.id ? "" : ""
              } cursor-pointer bg-${colorItem.bg} text-${colorItem.color}`}
              onClick={() => documentIdSetter(nav.id)}
            >
              {nav?.data?.image ? (
                <img
                  src={getObjectUrlFromDownloadUrl(nav?.data?.image)}
                  alt=""
                  className="original-img"
                />
              ) : (
                <img src={defaultUserImg} alt="" className="original-img" />
              )}

              {nav?.data?.title}
            </span>
          );
        })}
      </nav>
    </>
  );
};

export default GroupMenu;
