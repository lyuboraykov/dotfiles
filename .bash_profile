if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

#THIS MUST BE AT THE END OF THE FILE FOR GVM TO WORK!!!
[[ -s "/home/lraykov/.gvm/bin/gvm-init.sh" ]] && source "/home/lraykov/.gvm/bin/gvm-init.sh"
