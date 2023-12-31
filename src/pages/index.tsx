import ContactCard from "@/components/contact-card";
import ContactDetailModal from "@/components/contact-detail-modal";
import ContactList from "@/components/contact-list";
import Pagination from "@/components/pagination";
import AddContactIcon from "@/icons/add-contact-icon";
import { ContactContext } from "@/providers/contact-list-provider";
import { ContactContextType, ContactProfile } from "@/types/contact";
import { Global } from "@emotion/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import tw from "twin.macro";

export default function Home() {
  const globalStyles = {
    "*": {
      fontFamily: '"Open Sauce One", "Nunito Sans", sans-serif',
    },
  };
  //ROUTER & FETCH
  const router = useRouter();
  const { contacts, handleFetchSearch } = useContext(
    ContactContext
  ) as ContactContextType;

  //PAGINATION CONFIG

  const totalItems = 40;
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentContact, setCurrentContact] = useState<number>(0);

  // STATE CONTACTS

  const [contactList, setContacts] = useState<ContactProfile[]>([]);
  const [bookmarked, setBookmarked] = useState<ContactProfile[]>([]);

  //SEARCH

  const [name, setName] = useState<string>("");

  //MODAL DETAIL

  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);

  //FUNCTIONS

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleFetchSearch(newPage, name);
  };

  const handleAddBookmark = (i: number) => {
    const newArray = bookmarked;
    contactList && newArray.push(contactList[i]);

    setBookmarked(newArray);
    setContacts(contactList.filter((item, index) => index !== i));
  };

  const handleRemoveBookmark = (i: number) => {
    const newArray = contactList;
    contactList && newArray.push(bookmarked[i]);

    setBookmarked(bookmarked.filter((item, index) => index !== i));
    setContacts(newArray);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    handleFetchSearch(currentPage, name);
  };

  const handleAdd = (e: any) => {
    e.preventDefault();
    router.push("/add");
  };

  //USEEFFECT

  useEffect(() => {
    const data = localStorage.getItem("contacts") || null;
    // if (data) return setContacts(JSON.parse(data));
    if (contacts) {
      setContacts(contacts);
      setBookmarked([]);
    }
  }, [contacts]);

  return (
    <div css={tw`min-h-screen bg-[#F6F7FB] text-[#344054]`}>
      <div css={tw`mx-auto max-w-[1700px] lg:py-8`}>
        <main css={tw`flex justify-center max-h-screen`}>
          <ContactList>
            <div
              css={tw`flex flex-col gap-4 justify-start w-full py-3 font-bold text-2xl`}
            >
              <span>Contact List</span>
              <form action="submit" onSubmit={handleSearch}>
                <div>
                  <div css={tw`flex gap-2`}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Find Contact"
                      onChange={(event) => setName(event.currentTarget.value)}
                      value={name}
                      css={tw` rounded-md lg:w-full w-[400px] lg:px-4 px-2 border-gray-200 shadow-sm lg:text-lg h-8`}
                    />
                    <button
                      type="submit"
                      css={tw` bg-white flex rounded border border-gray-600 px-3 py-2 lg:px-12 text-sm font-medium text-gray-600 cursor-pointer hover:border-green-500 hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500`}
                    >
                      Search
                    </button>
                    <div
                      onClick={handleAdd}
                      css={tw` bg-white flex rounded border border-gray-600 justify-center items-center lg:px-4 cursor-pointer `}
                    >
                      <AddContactIcon />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {bookmarked?.map((contact: ContactProfile, index: number) => {
              return (
                <ContactCard
                  handleDetail={() => {
                    setCurrentContact(contact.id);
                    setShowModalDetail(true);
                  }}
                  isBoorkmark={true}
                  handleBookMark={() => handleRemoveBookmark(index)}
                  contact={contact}
                  key={index}
                />
              );
            })}
            {contactList?.map((contact: ContactProfile, index: number) => {
              return (
                <ContactCard
                  isBoorkmark={false}
                  handleDetail={() => {
                    setCurrentContact(contact.id);
                    setShowModalDetail(true);
                  }}
                  handleBookMark={() => handleAddBookmark(index)}
                  contact={contact}
                  key={index}
                />
              );
            })}
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </ContactList>
          <ContactDetailModal
            open={showModalDetail}
            onClose={() => setShowModalDetail(false)}
            id={currentContact}
            fetchContacts={() => handleFetchSearch(currentPage, name)}
          />
        </main>
      </div>
      <Global styles={globalStyles} />
    </div>
  );
}
