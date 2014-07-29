#don't run if called from a login shell
[ -z "$PS1" ] && return 

echo "Don't panic!"
source /home/lraykov/liquidprompt/liquidprompt

#THIS MUST BE AT THE END OF THE FILE FOR GVM TO WORK!!!
[[ -s "/home/lraykov/.gvm/bin/gvm-init.sh" ]] && source "/home/lraykov/.gvm/bin/gvm-init.sh"
