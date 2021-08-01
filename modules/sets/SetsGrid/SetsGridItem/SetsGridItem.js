import Link from "next/link";
import formatDateStrToUI from "../../../../helpers/date/formatDateStrToUI";
import FavouriteSolidIcon from "../../../../icons/FavouriteSolidIcon";
import GridIcon from "../../../../icons/GridIcon";

const SetsGridItem = (props) => {
    const createdAt = formatDateStrToUI(props.createdAt);
    const isFavourite = props.isFavourite && <FavouriteSolidIcon />;
    const totalCards =
        props.total > 1 ? `${props.total} cards` : `${props.total} card`;

    return (
        <Link href={`/sets/${props._id}`}>
            <div className="flex flex-col justify-between m-1 p-4 text-gray-600 bg-gray-100 rounded-md cursor-pointer hover:shadow">
                <div className="mb-4">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">{props.name}</p>
                        {isFavourite}
                    </div>
                    <p>{totalCards}</p>
                </div>
                <div className="text-sm">
                    <p className="flex items-center">
                        <span className="mr-1">
                            <GridIcon />
                        </span>
                        Created {createdAt}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default SetsGridItem;