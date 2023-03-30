#!/bin/bash

origin_cd=$(pwd)
# Useless function I wrote first in this project to make everything look "pretty" according to
# Continuum Reverie lore because who doesn't love pointlessly satisfying code and functionality, am I right?
si_echo () {
  str0="#.\""
  str1=$1 # $1 is the function's second argument; $0 is just the script name for some reason
  str2="\"_"
  echo $str0$str1$str2 # Concatenate strings and return the very neatly formatted string
}

# Playing hide and seek with Node.js on WSL
# Yes, all of this because my stubborn butt didn't want to install Node.js twice to appease Bash on WSL.
find_node () {
  # Find the npm config whihc should have the directory with main Node.js executable
  # I know, this is absolutely horrendous.
  # Yes, this took me at least one unnecessary hour to figure out and code.
  
  # Identify "lef=t side junk" and use it to find the string in npm config that we're looking for
  left_side_junk="; prefix = \""
  npm_config=$(npm config ls -l | grep "$left_side_junk") # npm is slow so this takes a few seconds

  # Cut off left side junk from the string
  left_side_junk_length=$(expr length "$left_side_junk")
  left_side_junk_length=$(($left_side_junk_length + 1)) # Add 1 to include the "
  total_length=$(expr length "$npm_config")

  where_is_node=$(expr substr "$npm_config" "$left_side_junk_length" "$total_length")

  # Cut off right side junk from the string (anything after the ")
  right_side_junk_position=$(expr index "$where_is_node" "\"")
  right_side_junk_position=$(($right_side_junk_position - 1)) # Subtract 1 to include the "
  where_is_node=$(expr substr "$where_is_node" 1 "$right_side_junk_position")

  # $where_is_node now contains Windows path for Node directory
  # https://stackoverflow.com/questions/13701218/windows-path-to-posix-path-conversion-in-bash
  # https://www.howtogeek.com/666395/how-to-use-the-sed-command-on-linux/
  # sed is a little weird thing. the syntax is `s/whattoreplace/withwhat/`, so you it is barely readable when we
  # have to use it to replace slashes with different slashes
  where_is_node=$(echo "/mnt/$where_is_node" | sed 's/\\/\//g' | sed 's/://' | sed 's/\/\//\//g' | sed 's/C/c/')
  # tl;dr
  # First sed does the slash substitution job, just poorly (replaces \\s with //s')
  # Second sed yeets the : from the C:
  # Third sed cleans up after the first - after s/, \/\/ mean "substitute //", after which you got the "/"
  #  separator for the command and a "\/", which is finally telling this cursed command to replace //s with a /
  #  Then we slap a /g to make it do this to every instance of // that it finds. Hey, as long as it works.
  # ... fourth sed added because apparently bash HATES that C is C and not c...

  # The problem with this cd here: https://stackoverflow.com/questions/255414/why-cant-i-change-directories-using-cd-in-a-script
  # cd "$where_is_node"
  # eval "node.exe" # Now this would work, because directory was only changed in a "subshell"... I guess?
  return "$where_is_node"

  # where_is_node=$(echo "$where_is_node/node.exe")
}

run_http_server () {
  # Check with npm if http-server is installed locally and put search results in a variable
  # It should contain "http-server" and some junk, hence it can be found by grep
  npmoutput=$(npm list | grep http-server)
  pkgname="http-server"
  if [ $(expr index "$pkgname" "$pkgname") = 0 ]; then # Look for absence of "http-server" in the junky string specifically
    si_echo "http-server is not installed in the local project directory"
    si_echo "Installing it for you now, because I am smart"
    npm install http-server
    npm fund
  else
    si_echo "Found http-server in the project directory"
    si_echo "Running it for you now, because I am smart"

    where_is_node=find_node
    cd "$where_is_node" 2> /dev/null # Redirect standard error to the v o i d because it won't shut up about ""not finding"" a directory
    eval "node.exe \"node_modules\http-server\bin\http-server\" -p 4444" # node_modules\http-server\bin\http-server 2>&1 & echo $! > server.pid"
    si_echo "The screenshot HTTP server is running at http://localhost:4444"
  fi
}

si_echo "brb running things for you"
# Navigate to the Minecraft screenshot folder
# Note: I don't know if that does anything useful anymore 💀
cd /mnt/d/Minecraft/New\ World\ 4\ stuff/New\ World\ 4\ screenshots/
run_http_server
