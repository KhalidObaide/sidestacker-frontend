import React from 'react';

function UserInformation() {
  const [fullname, setFullname] = React.useState<string>('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(fullname);
  };

  return (
    <form className="user-information" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        className="fullname"
        value={fullname}
        onChange={(event) => setFullname(event.target.value)}
      />
      <button type="submit" className="submit">Update</button>
    </form>
  );
}

export default UserInformation;
