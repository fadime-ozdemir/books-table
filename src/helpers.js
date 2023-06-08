
export const mergeSort = (arr, property, order, type) => {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), property, order, type);
    const right = mergeSort(arr.slice(mid), property, order, type);

    return merge(left, right, property, order, type);
};

const merge = (left, right, property, order, type) => {
    const sorted = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        const isLeftItemBigger = type === "number" ? Number(left[leftIndex][property]) < Number(right[rightIndex][property]) : ((left[leftIndex][property])?.trim())?.toLowerCase() < ((right[rightIndex][property])?.trim())?.toLowerCase();
        const isRightItemBigger = type === "number" ? Number(right[rightIndex][property]) < Number(left[leftIndex][property]) : ((right[rightIndex][property])?.trim())?.toLowerCase() < ((left[leftIndex][property])?.trim())?.toLowerCase();
        if (order === "asc" ? isLeftItemBigger : isRightItemBigger) {
            sorted.push(left[leftIndex]);
            leftIndex++;
        } else {
            sorted.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return sorted.concat(left.slice(leftIndex), right.slice(rightIndex));
};