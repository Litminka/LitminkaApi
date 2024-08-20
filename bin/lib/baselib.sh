# Version 1.1
set -o nounset
set -o pipefail

#####################################
#
# Error messages
#
#####################################

########################
# Prints ERROR message with timestamp
# Global:
#   None
# Arguments:
#   $1 String - Message
# Returns:
#   None
#########################
__msgErr() {
    local msg=$1
    local stack=${2:-0}

    echo -e "$(__timestamp) ERROR: $msg" >&2
    [ "$stack" -eq 1 ] && __getStack >&2
}

########################
# Prints WARN message with timestamp
# Global:
#   None
# Arguments:
#   $1 String - Message
# Returns:
#   None
#########################
__msgWarn() {
    local msg=$1

    echo -e "$(__timestamp) WARN: $msg" >&2
}

########################
# Prints INFO message with timestamp
# Global:
#   None
# Arguments:
#   $1 String - Message
# Returns:
#   None
#########################
__msgInfo() {
    local msg=$1

    echo -e "$(__timestamp) INFO: $msg" >&2
}

########################
# Prints DEBUG message with timestamp
# Global:
#   None
# Arguments:
#   $1 String - Message
# Returns:
#   None
#########################
__msgDebug() {
    local msg=$1
    __debug && echo -e "$(__timestamp) DEBUG: $msg" >&2
}

########################
# Gets stack of previous commands for debugging
# Global:
#   None
# Arguments:
#   None
# Returns:
#   String
#########################
__getStack() {
    local STACK=''
    # to avoid noise we start with 1 to skip __getStack caller
    local i
    local stack_size=${#FUNCNAME[@]}
    for ((i = 2; i < "$stack_size"; i++)); do
        local func="${FUNCNAME[$i]}"
        [ -z "$func" ] && func=MAIN

        local linen="${BASH_LINENO[((i - 1))]}"
        local src="${BASH_SOURCE[$i]}"

        [ -z "$src" ] && src=non_file_source

        STACK+="\t$func - $src: $linen\n"
    done

    echo -e "$STACK"
}

#####################################
#
# Base functions
#
#####################################

########################
# Check debug ENV variable
# Global:
#   DEBUG
# Arguments:
#   None
# Returns:
#   Boolean
#########################
__debug() {
    local _d_=${DEBUG:-0}
    [ "$_d_" -eq 1 ] && return 0
    return 1
}

########################
# Gets current timestamp in format '2024-06-17 06:35:27.551'
# Global:
#   None
# Arguments:
#   $1 String - message
# Returns:
#   String
#########################
__timestamp() {
    date +'%F %T.%3N'
}

########################
# Listening child processes
# Global:
#   None
# Arguments:
#   DEBUG
# Returns:
#   None
#########################
pidMonitor() {
    local PIDS=()
    while IFS='' read -r line; do PIDS+=("$line"); done < <(pgrep -P $$)

    __msgDebug "Waiting child PIDs: ${PIDS[*]}"
    for pid in "${PIDS[@]}"; do
        wait "$pid"
        __msgDebug "PID $pid - finished"
    done
}

########################
# Gets main process execution path
# Global:
#   None
# Arguments:
#   None
# Returns:
#   String
#########################
__getScriptPath() {
    local SOURCE
    local DIR

    SOURCE=${BASH_SOURCE[0]}

    # resolve $SOURCE until the file is no longer a symlink
    while [ -L "$SOURCE" ]; do
        DIR=$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)
        SOURCE=$(readlink "$SOURCE")
        # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
        [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
    done

    DIR=$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)

    echo "$DIR"
}

########################
# Validate that key exists in hashtable
# Global:
#   None
# Arguments:
#   String
# Returns:
#   Boolean
#########################
keyExists() {
    local -n HASHTABLE_REF=$1
    local KEY=$2

    if [[ "${!HASHTABLE_REF[*]}" =~ $KEY ]]; then
        return 0
    else
        return 1
    fi
}
