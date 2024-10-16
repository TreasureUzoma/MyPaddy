const Nav = () => {
  const handleNewChat = () => {
    window.open('#', '_blank')
  }
    return (
        <nav className="flex w-full fixed b-0 left-0 align-center justify-between px-6 py-5 top-0 bg-myBlack">
            <span class="font-bold text-lg">Paddy</span>
                        <button
                class="newchat-btn"
                id="newchat-btn"
                onClick={handleNewChat}
            >
                <i class="fa fa-plus"></i>
            </button>
        </nav>
    );
};
export default Nav;
