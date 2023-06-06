import { useEffect, useState, useRef } from "react";
import Icon from "./Icon";
import CloseIcon from "./CloseIcon";
import "./Dropdown.css";

interface User {
  id: number;
  name: string;
  username: string;
}

interface Props {
  placeHolder: string;
  users: User[];
  isMulti: boolean;
  isSearchable: boolean;
  onChange: (value: User) => void;
}

const Dropdown = ({
  placeHolder,
  users,
  isMulti,
  isSearchable,
  onChange,
}: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState<User[] | any>(
    isMulti ? [] : null!
  );
  const [searchValue, setSearchValue] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e: React.ChangeEvent<HTMLInputElement> | any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return users;
    }
    return users.filter(
      (users) =>
        users.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder;
    }
    if (isMulti) {
      return (
        <div className="dropdown-tags">
          {selectedValue.map((user: User) => (
            <div key={user.id} className="dropdown-tag-item">
              {user.name}
              <span
                onClick={() => onTagRemove(user)}
                className="dropdown-tag-close"
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      );
    }
    return selectedValue.name;
  };

  const removeOption = (user: User) => {
    return selectedValue?.filter((value: User) => value.name !== user.name);
  };

  const onTagRemove = (user: User) => {
    const newValue: User = removeOption(user);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (user: User) => {
    let newValue: User | User[];
    if (isMulti) {
      if (
        selectedValue!.findIndex((value: User) => value.id === user.id) >= 0
      ) {
        newValue = removeOption(user);
      } else {
        newValue = [...selectedValue!, user];
      }
    } else {
      newValue = user;
    }
    setSelectedValue(newValue!);
    onChange(newValue as User);
  };

  const isSelected = (user: User) => {
    if (isMulti) {
      return (
        selectedValue!.filter((value: User) => value.name === user.name)
          .length > 0
      );
    }
    if (!selectedValue) {
      return false;
    }
    return selectedValue.id === user.id;
  };

  return (
    <div className="dropdown-container">
      <div onClick={handleInputClick} className="dropdown-input">
        {showMenu && (
          <div className="dropdown-menu">
            {isSearchable && (
              <div className="search-box">
                <input
                  onChange={onSearch}
                  value={searchValue}
                  ref={searchRef}
                />
              </div>
            )}
            {getOptions().map((user: User) => (
              <div
                key={user.id}
                onClick={() => onItemClick(user)}
                className={`dropdown-item ${isSelected(user) && "selected"}`}
              >
                {user.name}
              </div>
            ))}
          </div>
        )}
        <div className="dropdown-selected-value">{getDisplay()}</div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <Icon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
