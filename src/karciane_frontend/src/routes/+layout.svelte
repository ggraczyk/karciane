

<nav>
	<a href="/kanasta">Kanasta</a>
	<a href="/about">About</a>
</nav>

<body></body>


<slot></slot>
<style>
body {
	font-family: "Montserrat", sans-serif;
	font-size: 1.5rem;
	background-color: rgb(98, 215, 176);
  }

  a{ text-decoration: none;
  font-size: 0.8rem;
  color: #16125c;
  transition: color 0.3s;
    &:hover{
    color: #ef4f4f;
    }
 }  

  nav {
  text-align: right;
  font-family: "Montserrat", sans-serif;
  font-size: 1.5rem;
  }

#error {
  font-family: "Montserrat", sans-serif;
  color: #fa0303;
  font-size: 1.0rem;
}  
span {
    font-family: "Montserrat", sans-serif;
    font-size: 1.5rem;
    }


</style>  