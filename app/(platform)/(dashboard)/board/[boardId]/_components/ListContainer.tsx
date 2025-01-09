"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import { reorderArr } from "@/lib/utils";
import { useAction } from "@/app/hooks/useAction";
import { updateListOrder } from "@/app/actions/updateListOrder";
import { updateCardOrder } from "@/app/actions/updateCardOrder";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`List reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(`Card reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    //dropped in the same position:
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //Case A: user moves a list
    if (type === "list") {
      const items = reorderArr(
        orderedData,
        source.index,
        destination.index,
      ).map((item, index) => ({ ...item, order: index }));
      //change local state
      setOrderedData(items);
      //trigger server action
      executeUpdateListOrder({ items, boardId });
    }

    //Case B: user moves a card
    if (type === "card") {
      let orderedDataCopy = [...orderedData];

      const sourceList = orderedDataCopy.find(
        (list) => list.id === source.droppableId,
      );
      const destList = orderedDataCopy.find(
        (list) => list.id === destination.droppableId,
      );

      if (!sourceList || !destList) return;

      //check if cards exists in the sourceList, avoid null, errors etc
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      //check if cards exists in the destList, avoid null, errors etc
      if (!destList.cards) {
        destList.cards = [];
      }

      //Case B-1:user moves cards within same list(same column)
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorderArr(
          sourceList.cards,
          source.index,
          destination.index,
        );
        //assign new positions for each card
        reorderedCards.forEach((card, idx) => (card.order = idx));

        sourceList.cards = reorderedCards;
        //set local state:
        setOrderedData(orderedDataCopy);
        //trigger server action
        executeUpdateCardOrder({ items: reorderedCards, boardId });
      }
      //Case B-2:user moves cards to other list(other column)
      else {
        //Remove card from source list:
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        //assign new listId (parent is list) to the moved card
        movedCard.listId = destination.droppableId;
        //Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);
        // change position number of cards in source list,
        sourceList.cards.forEach((card, idx) => (card.order = idx));
        // change position number of cards in destination list,
        destList.cards.forEach((card, idx) => (card.order = idx));

        //set local data:
        setOrderedData(orderedDataCopy);
        // trigger server action
        executeUpdateCardOrder({ items: destList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
