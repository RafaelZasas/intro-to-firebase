// This function will be called in every html page other than index due to path's being different
function populateNavbar() {
    let headTag = document.querySelector('#navbar');
    headTag.innerHTML = `
    <div class="navbar-brand">
        <a class="navbar-item" href="../../index.html">
            <img src="../assets/dsc_lockup.png" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">

            <div class="navbar-item has-dropdown is-hoverable">

                <a class="navbar-link">
                    Products
                </a>

                <!--   dropdown section for products -->
                <div class="navbar-dropdown">
                    <a class="navbar-item" href="../html/shoes.html">
                        Shoes
                    </a>
                    <a class="navbar-item" href="../html/shirts.html">
                        Shirts
                    </a>
                    <a class="navbar-item" href="../html/bags.html">
                        Bags
                    </a>
                    <a class="navbar-item" href="../html/hats.html">
                        Hats
                    </a>
                </div>
            </div>
            
            <a class="navbar-item" href="https://dsc.community.dev"> <!--  could be cool to implement google maps api -->
                Locations
            </a>


            <!--  dropdown section for More -->
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    More
                </a>

                <div class="navbar-dropdown">
                    <a class="navbar-item" href="../html/resources.html">
                        Resources
                    </a>
                    <a class="navbar-item" href="https://github.com/RafaelZasas/intro-to-firebase/blob/develop
/docs/CONTRIBUTING.md">
                        Contribute to this website
                    </a>
                    <hr class="navbar-divider">
                    <a class="navbar-item" href="https://github.com/RafaelZasas/intro-to-firebase/issues">
                        Report an issue
                    </a>
                </div>
            </div>


        </div>
        <div id='loginSection'>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <div id="log-in">
                            <a class="button is-light" href="./signIn.html">
                                <strong>Log in</strong>
                            </a>
                        </div>
                        <!-- <div id="log-in">
                            <a class="button is-light" onclick="signInWithGoogle()">
                                <strong>Log in</strong>
                            </a>
                        </div> -->
                        <div id="profile">
                            <a class="button is-primary" href="./profile.html">
                                <strong>Profile</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
