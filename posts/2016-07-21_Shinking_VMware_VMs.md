(((
Title: Shrinking VMware VMs with Fusion
Date: 2016-07-21 19:16:00
Author: Nicholas Zwart
Summary: A .bashrc function for automating the defragmenting and shrinking of VMs.
)))

Add the following function to your ~/.bashrc:
```bash
# VMWARE
# assumes the PATH is setup
function shrinkVM {

    # path to vmware tool
    VDISKMAN="vmware-vdiskmanager"

    # find all vmx files
    VMX=()
    for name in $(find $1 -iname "*.vmx")
    do
        VMX+=($name)
    done

    # find all vmdk files
    VMDK=()
    for name in ${VMX[@]}
    do
        # get the current vmdk list from the vmx file
        IFS_backup=$IFS
        IFS=$'\n'
        VMDK_sub=($(grep -o "\".*\.vmdk\"" $name))
        IFS=$IFS_backup

        # get the location of these disks
        VMDK_dir=$(dirname $name)

        # append the relative dirs to the listed disks
        #for disk in ${VMDK_sub[@]}
        for ((i=0; i<${#VMDK_sub[@]}; i++));
        do
            disk=${VMDK_sub[$i]}
            disk="${disk%\"}" # remove suffix "
            disk="${disk#\"}" # remove prefix "
            disk=$( echo "$disk" | sed 's/ /\\ /g' ) # deref spaces
            VMDK+=("$(pwd)/${VMDK_dir}/${disk}")
        done
    done

    time {
        for ((i=0; i<${#VMDK[@]}; i++));
        do
            CMD="$VDISKMAN -d ${VMDK[$i]} && $VDISKMAN -k ${VMDK[$i]}"
            echo $CMD
            eval $CMD
        done
    }
}
```

Update your environment by
executing:
```bash
$ source .bashrc
```

Now you can run `shrinkVM` on your VM directory:
```bash
$ shrinkVM ./vmware/Ubuntu64.vmwarevm
```

Or on your entire collection of VMs:
```bash
$ shrinkVM ./vmware/
```
