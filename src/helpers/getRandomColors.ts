const randomColor = () => {
  const colors = ['#005266','#00ccff','#0033cc','#1a53ff','#3333cc','#6600cc','#9900cc','#660033','#e60073','#ff66b3','#ff6666','#b30000','#cc6600','#ff5050','#660000','#ff9900','#cc7a00','#663300','#999966','#669900','#999966','#336600','#009933','#339966','#00cc99','#ff3399','#009999','#0099cc','#3333ff','#0099ff','#9999ff','#000066','#336699','#006666','#99cc00','#33ff77'];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export default randomColor;