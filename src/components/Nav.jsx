const Nav = () => {
    const handleNewChat = () => {
        window.open("#", "_blank");
    };
    return (
        <nav className="flex w-full sticky right-0 left-0 align-center justify-between px-6 py-5 top-0 bg-myBlack z-30">
            <span className="font-bold text-lg">Paddy</span>
            <button 
              onClick={handleNewChat}
              className="border border-2 rounded-xl px-2 py-[2px]"
              >
                <i className="fa fa-plus text-sm"></i>
            </button>
        </nav>
    );
};
export default Nav;
